export function isValidIndicatorScore(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 100;
}

export function validateIndicatorScore(value: string): string | null {
  const num = Number(value);
  if (isNaN(num)) return "Masukkan angka yang valid";
  if (num < 0 || num > 100) return "Masukkan angka antara 0 hingga 100";
  return null;
}
