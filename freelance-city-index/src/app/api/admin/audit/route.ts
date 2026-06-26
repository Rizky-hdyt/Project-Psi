import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  try {
    const logs = await prisma.auditLog.findMany({
      include: { district: { select: { nama: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: "Gagal memuat audit log" }, { status: 500 });
  }
}
