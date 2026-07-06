"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

interface AdminState {
  isAuthenticated: boolean;
  username: string;
  checking: boolean; // true saat verifikasi session pertama kali
  forbidden: boolean; // sesi ada tapi tidak valid lagi (bukan "belum login")
}

type AdminAction =
  | { type: "SET_SESSION"; username: string }
  | { type: "CLEAR_SESSION" }
  | { type: "DONE_CHECKING" }
  | { type: "SESSION_FORBIDDEN" };

const initialState: AdminState = {
  isAuthenticated: false,
  username: "",
  checking: true,
  forbidden: false,
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "SET_SESSION":
      return { isAuthenticated: true, username: action.username, checking: false, forbidden: false };
    case "CLEAR_SESSION":
      return { isAuthenticated: false, username: "", checking: false, forbidden: false };
    case "DONE_CHECKING":
      return { ...state, checking: false };
    case "SESSION_FORBIDDEN":
      return { isAuthenticated: false, username: "", checking: false, forbidden: true };
    default:
      return state;
  }
}

export interface BulkScoreItem {
  indicatorId: string;
  skor: number;
  expectedUpdatedAt?: string | null;
}

export interface BulkSaveResult {
  ok: boolean;
  conflict?: boolean;
  error?: string;
}

interface AdminContextValue {
  state: AdminState;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateScore: (districtId: string, indicatorId: string, skor: number) => Promise<{ ok: boolean; error?: string }>;
  updateScoresBulk: (districtId: string, indicators: BulkScoreItem[]) => Promise<BulkSaveResult>;
  updateSubDistrictScoresBulk: (subDistrictId: string, indicators: BulkScoreItem[]) => Promise<BulkSaveResult>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Verifikasi session dari cookie saat pertama load (agar refresh tidak logout)
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          dispatch({ type: "SET_SESSION", username: data.username });
        } else if (data.reason === "invalid_session") {
          dispatch({ type: "SESSION_FORBIDDEN" });
        } else {
          dispatch({ type: "DONE_CHECKING" });
        }
      })
      .catch(() => dispatch({ type: "DONE_CHECKING" }));
  }, []);

  async function login(username: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      dispatch({ type: "SET_SESSION", username });
      return { ok: true };
    }
    const data = await res.json();
    return { ok: false, error: data.error ?? "Login gagal" };
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch({ type: "CLEAR_SESSION" });
  }

  async function updateScore(districtId: string, indicatorId: string, skor: number) {
    const res = await fetch("/api/admin/scores", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ districtId, indicatorId, skor }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json();
    return { ok: false, error: data.error ?? "Gagal menyimpan" };
  }

  // Simpan 4 indikator sekaligus dalam SATU transaksi database (atomic — tidak
  // ada kondisi "3 kesimpan, 1 gagal") + optimistic locking (kalau ada sesi
  // lain yang sudah mengubah data ini sejak form dibuka, tolak dengan 409
  // daripada menimpa diam-diam). Memenuhi PRD §6.2 edge case "dua admin
  // update bersamaan" dan "koneksi putus saat simpan, atomic transaction".
  async function updateScoresBulk(
    districtId: string,
    indicators: BulkScoreItem[]
  ): Promise<BulkSaveResult> {
    const res = await fetch("/api/admin/scores/bulk", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ districtId, indicators }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json();
    if (res.status === 409) {
      return { ok: false, conflict: true, error: data.message ?? "Data ini sudah diubah di sesi lain" };
    }
    return { ok: false, conflict: false, error: data.error ?? "Gagal menyimpan" };
  }

  // Sama pola dengan updateScoresBulk, cuma target endpoint & body key beda
  // (subDistrictId, bukan districtId) — kecamatan punya tabel skor sendiri.
  async function updateSubDistrictScoresBulk(
    subDistrictId: string,
    indicators: BulkScoreItem[]
  ): Promise<BulkSaveResult> {
    const res = await fetch("/api/admin/subdistrict-scores/bulk", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subDistrictId, indicators }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json();
    if (res.status === 409) {
      return { ok: false, conflict: true, error: data.message ?? "Data ini sudah diubah di sesi lain" };
    }
    return { ok: false, conflict: false, error: data.error ?? "Gagal menyimpan" };
  }

  return (
    <AdminContext.Provider
      value={{ state, login, logout, updateScore, updateScoresBulk, updateSubDistrictScoresBulk }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
