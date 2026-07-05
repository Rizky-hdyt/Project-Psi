import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  // Bedakan "belum pernah login" (redirect ke /admin/login) dari "sesi ada
  // tapi sudah tidak valid/kedaluwarsa/dirusak" (redirect ke /admin/403) —
  // PRD §6.2 decision point "role check" butuh dua jalur berbeda, bukan
  // cuma satu redirect generik ke login.
  if (!token) {
    return NextResponse.json({ authenticated: false, reason: "no_session" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false, reason: "invalid_session" }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, username: payload.username });
}
