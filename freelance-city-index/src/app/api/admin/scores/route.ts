import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { districtId, indicatorId, skor } = await req.json();

    if (typeof skor !== "number" || skor < 0 || skor > 100) {
      return NextResponse.json(
        { error: "Nilai skor harus antara 0 dan 100" },
        { status: 400 }
      );
    }

    // Ambil nilai lama untuk audit log
    const existing = await prisma.districtScore.findUnique({
      where: { districtId_indicatorId: { districtId, indicatorId } },
    });
    const nilaiLama = existing?.skor ?? 0;

    // Update skor
    const updated = await prisma.districtScore.upsert({
      where: { districtId_indicatorId: { districtId, indicatorId } },
      update: { skor, updatedAt: new Date() },
      create: { districtId, indicatorId, skor },
    });

    // Catat di audit log
    await prisma.auditLog.create({
      data: {
        districtId,
        indicatorId,
        nilaiLama,
        nilaiBaru: skor,
        operator: session.username,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan skor" }, { status: 500 });
  }
}
