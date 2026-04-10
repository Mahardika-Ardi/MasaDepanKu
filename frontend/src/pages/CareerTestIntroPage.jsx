import { Link, useNavigate } from "react-router-dom";

const highlights = [
  {
    title: "20 Pertanyaan Terarah",
    description:
      "Setiap pertanyaan dirancang untuk memetakan preferensi kerja dan gaya berpikir kamu.",
  },
  {
    title: "Singkirkan Gangguan",
    description:
      "Kerjakan dengan fokus agar rekomendasi minat dan arah karir jadi lebih akurat.",
  },
  {
    title: "Hasil Siap Ditindaklanjuti",
    description:
      "Dapatkan ringkasan kekuatan, area pengembangan, dan rekomendasi peran kerja.",
  },
];

function CareerTestIntroPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#191b22] px-4 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#15171d] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.42)] lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Tes Minat Bakat</p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight lg:text-5xl">
                Mulai Jelajah Karir
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#c5cbd8]">
                Sebelum mulai, siapkan waktu sebentar dan jawab sesuai kondisi diri kamu.
                Tes ini dibuat untuk membantu kamu menemukan kecocokan minat dan arah pengembangan karir.
              </p>
            </div>

            <Link
              to="/beranda"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Kembali ke Beranda
            </Link>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-white/8 bg-[#1c1f27] p-5 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
              >
                <h2 className="text-[20px] font-semibold text-[#dfe5f3]">{item.title}</h2>
                <p className="mt-3 text-[14px] leading-6 text-[#b7bfce]">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="relative z-10 mt-8 flex flex-col items-center gap-4 rounded-[20px] border border-white/10 bg-[#1b1d24] px-5 py-7">
            <p className="text-center text-[14px] leading-6 text-[#bac2d2]">
              Siap mulai tes? Klik tombol di bawah untuk mengambil soal minat dan bakat.
            </p>

            <button
              type="button"
              onClick={() => navigate("/career-test")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0c66c2] to-[#1f8bff] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(12,102,194,0.4)] transition hover:from-[#0a5ab0] hover:to-[#3198ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
            >
              <span>Ambil Tes Minat dan Bakat</span>
              <span className="transition group-hover:translate-x-0.5">&gt;</span>
            </button>

            <p className="text-[12px] text-[#8f98aa]">Estimasi waktu pengerjaan 7-10 menit.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CareerTestIntroPage;
