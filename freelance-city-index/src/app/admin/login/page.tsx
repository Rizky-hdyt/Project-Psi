"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLoginPage() {
  const { state, login } = useAdmin();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Satu-satunya tempat redirect, useEffect memantau isAuthenticated
  // Tidak boleh ada router.push/replace lain untuk /admin agar tidak double navigate
  useEffect(() => {
    if (state.isAuthenticated) {
      router.replace("/admin");
    }
  }, [state.isAuthenticated, router]);

  // Saat cek session masih berjalan, tampil blank halus, bukan null
  // agar tidak ada flash konten saat checking → done
  if (state.checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--a-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--a-line-2)] border-t-[var(--a-red)]" />
      </div>
    );
  }

  // Sudah login, tunggu useEffect redirect, jangan render form
  if (state.isAuthenticated) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Username tidak boleh kosong");
      return;
    }
    if (!password) {
      setError("Password tidak boleh kosong");
      return;
    }

    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);

    // Jangan router.push di sini, useEffect sudah handle redirect saat
    // state.isAuthenticated berubah jadi true setelah login() berhasil
    if (!result.ok) {
      setError(result.error ?? "Username atau password salah");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--a-bg)] px-4">
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-[var(--a-muted)] transition-colors hover:text-[var(--a-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>
      </div>

      <div className="w-full max-w-sm rounded-[18px] border border-[var(--a-line-2)] bg-white p-7 shadow-[0_2px_4px_rgba(25,29,39,.03),0_8px_24px_rgba(25,29,39,.05)]">
        {/* Header */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div
            className="mb-4 grid h-11 w-11 place-items-center rounded-xl text-lg font-extrabold text-white"
            style={{
              background: "linear-gradient(135deg,#f04156,var(--a-red-dark))",
              boxShadow: "0 4px 10px rgba(224,38,60,.28)",
            }}
          >
            F
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--a-ink)]">Admin Panel</h1>
          <p className="mt-1 text-sm font-semibold text-[var(--a-muted)]">
            Freelance City Index — DIY Edition
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-bold text-[var(--a-ink-2)]">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="admin"
              aria-invalid={!!error}
              className="min-h-11 w-full rounded-[10px] border border-[var(--a-line-2)] bg-white px-3 text-sm text-[var(--a-ink)] outline-none transition-colors focus:border-[#f2aab5] focus:shadow-[0_0_0_3px_rgba(224,38,60,.07)]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-[var(--a-ink-2)]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••••••"
                aria-invalid={!!error}
                className="min-h-11 w-full rounded-[10px] border border-[var(--a-line-2)] bg-white px-3 pr-10 text-sm text-[var(--a-ink)] outline-none transition-colors focus:border-[#f2aab5] focus:shadow-[0_0_0_3px_rgba(224,38,60,.07)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-[var(--a-muted)] after:absolute after:-inset-3 after:content-[''] hover:text-[var(--a-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a-red)]"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-[10px] border px-3 py-2 text-sm font-semibold"
              style={{ borderColor: "var(--a-red-border)", background: "var(--a-red-soft)", color: "var(--a-red)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--a-red)] text-sm font-bold text-white shadow-[0_2px_6px_rgba(224,38,60,.25)] transition-colors hover:bg-[var(--a-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
