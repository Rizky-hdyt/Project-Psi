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

// Sama persis pola /api/admin/scores/bulk (transaksi atomic + optimistic
// locking), diterapkan ke SubDistrictScore. Audit log tetap ditulis ke tabel
// AuditLog yang sama (districtId = distrik induk kecamatan, subDistrictId +
// subDistrictNama diisi supaya beda dari edit distrik biasa).
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { subDistrictId, indicators } = (await req.json()) as {
      subDistrictId: string;
      indicators: BulkItem[];
    };

    if (!subDistrictId || !Array.isArray(indicators) || indicators.length === 0) {
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

    const subDistrict = await prisma.subDistrict.findUnique({ where: { id: subDistrictId } });
    if (!subDistrict) {
      return NextResponse.json({ error: "Kecamatan tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const rows = [];
      for (const item of indicators) {
        const existing = await tx.subDistrictScore.findUnique({
          where: { subDistrictId_indicatorId: { subDistrictId, indicatorId: item.indicatorId } },
        });

        if (
          existing &&
          item.expectedUpdatedAt &&
          existing.updatedAt.toISOString() !== item.expectedUpdatedAt
        ) {
          throw new ConflictError(item.indicatorId, existing.updatedAt.toISOString());
        }

        const nilaiLama = existing?.skor ?? 0;

        const row = await tx.subDistrictScore.upsert({
          where: { subDistrictId_indicatorId: { subDistrictId, indicatorId: item.indicatorId } },
          update: { skor: item.skor, updatedAt: new Date() },
          create: { subDistrictId, indicatorId: item.indicatorId, skor: item.skor },
        });

        await tx.auditLog.create({
          data: {
            districtId: subDistrict.districtId,
            indicatorId: item.indicatorId,
            nilaiLama,
            nilaiBaru: item.skor,
            operator: session.username,
            subDistrictId,
            subDistrictNama: subDistrict.nama,
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
            "Data kecamatan ini sudah diubah di sesi lain sejak Anda membuka halaman ini. Muat ulang halaman sebelum menyimpan lagi.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Gagal menyimpan skor" }, { status: 500 });
  }
}
