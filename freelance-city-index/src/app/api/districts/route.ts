import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      include: { scores: true, subDistricts: { include: { scores: true } } },
      orderBy: { nama: "asc" },
    });
    return NextResponse.json(districts);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data distrik" }, { status: 500 });
  }
}
