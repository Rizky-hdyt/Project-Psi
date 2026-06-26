import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const district = await prisma.district.findUnique({
      where: { id },
      include: { scores: true },
    });
    if (!district) {
      return NextResponse.json({ error: "Distrik tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(district);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data distrik" }, { status: 500 });
  }
}
