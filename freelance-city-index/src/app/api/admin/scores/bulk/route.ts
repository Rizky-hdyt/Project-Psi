import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface BulkItem {
  indicatorId: string;
  skor: number;
  expectedUpdatedAt?: string | null;
}

class ConflictError extends Error {
  indicatorId: string;
  currentUpdatedAt: string;
  constructor(indicatorId: string, currentUpdatedAt: string) {
    super("conflict");
    this.indicatorId = indicatorId;
    this.currentUpdatedAt = currentUpdatedAt;
  }
}

// Simpan beberapa indikator distrik sekaligus dalam SATU transaksi database
// (PRD §6.2 edge case: "koneksi database putus saat admin tekan Simpan" harus
// atomic — tidak ada data tersimpan sebagian) sekaligus optimistic locking
// (PRD §6.2 edge case: "dua admin update distrik sama bersamaan" — admin yang
// belakangan simpan harus dapat peringatan konflik, bukan menimpa diam-diam).
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { districtId, indicators } = (await req.json()) as {
      districtId: string;
      indicators: BulkItem[];
    };

    if (!districtId || !Array.isArray(indicators) || indicators.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    for (const item of indicators) {
      if (typeof item.skor !== "number" || item.skor < 0 || item.skor > 100) {
        return NextResponse.json(
          { error: `Nilai skor untuk ${item.indicatorId} harus antara 0 dan 100` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const rows = [];
      for (const item of indicators) {
        const existing = await tx.districtScore.findUnique({
          where: { districtId_indicatorId: { districtId, indicatorId: item.indicatorId } },
        });

        if (
          existing &&
          item.expectedUpdatedAt &&
          existing.updatedAt.toISOString() !== item.expectedUpdatedAt
        ) {
          throw new ConflictError(item.indicatorId, existing.updatedAt.toISOString());
        }

        const nilaiLama = existing?.skor ?? 0;

        const row = await tx.districtScore.upsert({
          where: { districtId_indicatorId: { districtId, indicatorId: item.indicatorId } },
          update: { skor: item.skor, updatedAt: new Date() },
          create: { districtId, indicatorId: item.indicatorId, skor: item.skor },
        });

        await tx.auditLog.create({
          data: {
            districtId,
            indicatorId: item.indicatorId,
            nilaiLama,
            nilaiBaru: item.skor,
            operator: session.username,
          },
        });

        rows.push(row);
      }
      return rows;
    });

    return NextResponse.json({ ok: true, updated });
  } catch (e) {
    if (e instanceof ConflictError) {
      return NextResponse.json(
        {
          error: "conflict",
          indicatorId: e.indicatorId,
          currentUpdatedAt: e.currentUpdatedAt,
          message:
            "Data distrik ini sudah diubah di sesi lain sejak Anda membuka halaman ini. Muat ulang halaman sebelum menyimpan lagi.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Gagal menyimpan skor" }, { status: 500 });
  }
}
