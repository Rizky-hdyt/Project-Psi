// Ambient background dipakai di SEMUA halaman publik (Landing, Quiz, Result,
// District, Compare, Assistant, Algoritma) — TIDAK di /admin/* (admin punya
// identitas sendiri: sidebar solid, bukan "mengambang" di atas ambient).
// Fixed di belakang seluruh konten supaya section/panel yang backgroundnya
// transparan terasa satu identitas visual konsisten di semua halaman.
//
// Arah gradasi kiri→kanan: warna hangat (mentari) pekat di kiri, memudar
// PELAN-PELAN ke kanan tapi tetap kelihatan (bukan rata/flat di ujung kanan).
// linear-gradient 90deg jadi PEMBAWA UTAMA warnanya karena berlaku sama di
// semua ketinggian scroll (tidak seperti radial-gradient yang otomatis
// melemah kalau posisi Y menjauh dari titik pusatnya — itu penyebab bug
// "warna hilang di tengah" versi sebelumnya, karena bagian yang paling sering
// kelihatan, yaitu tepi bawah viewport, jauh dari pusat radial-nya). Radial
// glow di sini cuma aksen tipis tambahan dekat kiri-atas, bukan pembawa utama.
export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 -z-30 overflow-hidden bg-paper"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(45% 50% at 4% 10%, rgba(255,178,120,0.35) 0%, rgba(255,178,120,0) 80%), " +
          "radial-gradient(40% 45% at 2% 38%, rgba(220,35,64,0.12) 0%, rgba(246,245,250,0) 80%), " +
          "radial-gradient(35% 35% at 97% 8%, rgba(13,148,136,0.06) 0%, rgba(246,245,250,0) 85%), " +
          "linear-gradient(90deg, #f6d3ab 0%, #f3d5bb 15%, #efd6c9 30%, #ead7d5 45%, #e4d8de 60%, #ded9e6 75%, #e0dcec 90%, #e6e5ef 100%)",
      }}
    />
  );
}
