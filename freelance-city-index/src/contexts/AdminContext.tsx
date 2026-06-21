"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import seedData from "@/data/districts.seed.json";
import type { DistrictScore } from "@/types/district";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: "UPDATE";
  districtId: string;
  indicatorId: string;
  oldValue: number;
  newValue: number;
  operator: string;
}

interface AdminState {
  isAuthenticated: boolean;
  scores: DistrictScore[];
  auditLog: AuditEntry[];
}

type AdminAction =
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | {
      type: "UPDATE_SCORE";
      payload: { districtId: string; indicatorId: string; skor: number; oldValue: number };
    };

const initialScores: DistrictScore[] = seedData.scores.map((s) => ({
  districtId: s.districtId,
  indicatorId: s.indicatorId as DistrictScore["indicatorId"],
  skor: s.skor,
  updatedAt: s.updatedAt,
}));

const initialState: AdminState = {
  isAuthenticated: false,
  scores: initialScores,
  auditLog: [],
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, isAuthenticated: false };
    case "UPDATE_SCORE": {
      const { districtId, indicatorId, skor, oldValue } = action.payload;
      const now = new Date().toISOString();
      const entry: AuditEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: now,
        action: "UPDATE",
        districtId,
        indicatorId,
        oldValue,
        newValue: skor,
        operator: "admin",
      };
      return {
        ...state,
        scores: state.scores.map((s) =>
          s.districtId === districtId && s.indicatorId === indicatorId
            ? { ...s, skor, updatedAt: now }
            : s
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }
    default:
      return state;
  }
}

interface AdminContextValue {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateScore: (districtId: string, indicatorId: string, skor: number) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  function login(username: string, password: string): boolean {
    if (username === "admin" && password === "freelancecity2026") {
      dispatch({ type: "LOGIN" });
      return true;
    }
    return false;
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
  }

  function updateScore(districtId: string, indicatorId: string, skor: number) {
    const current = state.scores.find(
      (s) => s.districtId === districtId && s.indicatorId === indicatorId
    );
    dispatch({
      type: "UPDATE_SCORE",
      payload: { districtId, indicatorId, skor, oldValue: current?.skor ?? 0 },
    });
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
