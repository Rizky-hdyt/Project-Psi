"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const { state, login } = useAdmin();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Satu-satunya tempat redirect — useEffect memantau isAuthenticated
  // Tidak boleh ada router.push/replace lain untuk /admin agar tidak double navigate
  useEffect(() => {
    if (state.isAuthenticated) {
      router.replace("/admin");
    }
  }, [state.isAuthenticated, router]);

  // Saat cek session masih berjalan — jangan tampil form dulu (cegah flash)
  if (state.checking) return null;

  // Sudah login — tunggu useEffect redirect, jangan render form
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

    // Jangan router.push di sini — useEffect sudah handle redirect saat
    // state.isAuthenticated berubah jadi true setelah login() berhasil
    if (!result.ok) {
      setError(result.error ?? "Username atau password salah");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>
      </div>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sawah">
            <span className="font-mono text-lg font-bold text-white">F</span>
          </div>
          <h1 className="text-xl font-semibold text-ink">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Freelance City Index — Yogyakarta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium text-ink">
              Username
            </Label>
            <Input
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
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </Label>
            <div className="relative">
              <Input
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
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full gap-2 bg-sawah text-white hover:bg-sawah/90"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
