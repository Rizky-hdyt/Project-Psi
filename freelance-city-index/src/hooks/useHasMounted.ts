"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

// Deteksi "sudah mount di client" tanpa setState-in-effect (dipakai untuk
// komponen yang portal ke document.body — document belum ada saat SSR).
// useSyncExternalStore dengan getServerSnapshot berbeda dari getSnapshot
// adalah pola resmi React untuk ini, bukan useState+useEffect.
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
