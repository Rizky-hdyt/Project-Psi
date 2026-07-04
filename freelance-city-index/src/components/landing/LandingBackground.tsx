import Image from "next/image";

// Background berlapis khusus landing (Landing_Page_Spec.md §Background):
// gradient hangat + glow putih besar + foto lanskap DIY redup — fixed di
// belakang seluruh halaman supaya section-section di atasnya terasa
// "mengambang" (glassmorphism), bukan blok warna solid berbatas tegas.
export function LandingBackground() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden bg-paper" aria-hidden="true">
      <Image
        src="/images/hero-yogyakarta.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[0.16]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(220,35,64,0.14) 0%, rgba(246,245,250,0) 70%), radial-gradient(55% 45% at 100% 10%, rgba(13,148,136,0.12) 0%, rgba(246,245,250,0) 70%), radial-gradient(80% 60% at 50% 100%, rgba(255,255,255,0.9) 0%, rgba(246,245,250,0.4) 60%)",
        }}
      />
      <div className="absolute inset-0 bg-paper/70" />
    </div>
  );
}
