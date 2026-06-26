import { NextResponse } from "next/server";
import { signToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME ?? "admin";
    const validPassword = process.env.ADMIN_PASSWORD ?? "freelancecity2026";

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const token = await signToken({ username });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch {
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
