"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

interface AdminState {
  isAuthenticated: boolean;
  username: string;
  checking: boolean; // true saat verifikasi session pertama kali
}

type AdminAction =
  | { type: "SET_SESSION"; username: string }
  | { type: "CLEAR_SESSION" }
  | { type: "DONE_CHECKING" };

const initialState: AdminState = {
  isAuthenticated: false,
  username: "",
  checking: true,
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "SET_SESSION":
      return { isAuthenticated: true, username: action.username, checking: false };
    case "CLEAR_SESSION":
      return { isAuthenticated: false, username: "", checking: false };
    case "DONE_CHECKING":
      return { ...state, checking: false };
    default:
      return state;
  }
}

interface AdminContextValue {
  state: AdminState;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateScore: (districtId: string, indicatorId: string, skor: number) => Promise<{ ok: boolean; error?: string }>;
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

  return (
    <AdminContext.Provider value={{ state, login, logout, updateScore }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
