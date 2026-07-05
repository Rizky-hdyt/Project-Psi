import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_PERSONA_IDS = [
  "tech-professional",
  "creative-professional",
  "student-fresh-graduate",
  "digital-nomad",
];

export async function POST(req: Request) {
  try {
    const { relevansi, kemudahan, komentar, personaId } = await req.json();

    if (
      typeof relevansi !== "number" ||
      !Number.isInteger(relevansi) ||
      relevansi < 1 ||
      relevansi > 5
    ) {
      return NextResponse.json(
        { error: "Nilai relevansi harus bilangan bulat 1-5" },
        { status: 400 }
      );
    }

    if (
      typeof kemudahan !== "number" ||
      !Number.isInteger(kemudahan) ||
      kemudahan < 1 ||
      kemudahan > 5
    ) {
      return NextResponse.json(
        { error: "Nilai kemudahan harus bilangan bulat 1-5" },
        { status: 400 }
      );
    }

    if (personaId !== null && personaId !== undefined && !VALID_PERSONA_IDS.includes(personaId)) {
      return NextResponse.json({ error: "personaId tidak valid" }, { status: 400 });
    }

    const created = await prisma.survey.create({
      data: {
        relevansi,
        kemudahan,
        komentar: typeof komentar === "string" && komentar.trim() ? komentar.trim().slice(0, 300) : null,
        personaId: personaId ?? null,
      },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan survei" }, { status: 500 });
  }
}
