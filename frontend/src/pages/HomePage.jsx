import { useNavigate } from "react-router-dom";
import profilePhoto from "../assets/beranda/photo_profile.png";
import posterImage from "../assets/beranda/rekomendasi_kampus.png";
import careerImage from "../assets/beranda/ilustrasi_minat_bakat.png";

const topNav = ["Halaman Utama", "Jaringan Saya", "Pekerjaan", "Pesan"];
const leftShortcuts = ["Item yang disimpan", "Grup", "Buletin", "Acara"];
const postActions = ["Media", "Acara", "Tulis Artikel"];
const postFooter = ["Suka", "Komentar", "Bagikan", "Kirim"];
const rightNews = [
  {
    title: "Anak SMK di Malang Lolos SNBP di Kampus Negeri Favorit",
    snippet: "Perjuangan tiga tahun terbayar lunas setelah berhasil menembus seleksi tanpa tes.",
    time: "12 menit yang lalu",
    views: "18.204 pembaca",
  },
  {
    title: "Siswa SMK Temukan Prototipe Sensor Hemat Energi Saat Praktik",
    snippet: "Temuan sederhana dari bengkel sekolah ini langsung menarik perhatian guru pembimbing.",
    time: "45 menit yang lalu",
    views: "7.981 pembaca",
  },
  {
    title: "Tim SMK Raih Juara Lomba Inovasi Berkat Aplikasi Bikinan Sendiri",
    snippet: "Aplikasi untuk membantu manajemen kelas dinilai paling praktis dan tepat guna.",
    time: "3 jam yang lalu",
    views: "42.670 pembaca",
  },
  {
    title: "Siswa Jurusan TKJ Ciptakan Solusi Wi-Fi Murah untuk Desa",
    snippet: "Proyek tugas akhir ini kini diuji coba di lingkungan sekitar sekolah.",
    time: "1 hari yang lalu",
    views: "254.457 pembaca",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const handlePlaceholder = () => {};

  return (
    <main className="min-h-screen bg-[#191b22] text-[#d7dae2]">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-3 lg:px-6">
        <header className="mb-4 h-10 rounded-[2px] bg-[#23262d] px-5 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
          <nav className="flex h-full items-center justify-center gap-8 text-[12px] text-[#b7becb]">
            {topNav.map((item) => (
              <button
                key={item}
                type="button"
                onClick={handlePlaceholder}
                className="transition hover:text-white"
              >
                {item}
              </button>
            ))}
            <button type="button" onClick={handlePlaceholder} className="text-[13px] hover:text-white">
              🔔
            </button>
            <button type="button" onClick={handlePlaceholder} className="text-[13px] hover:text-white">
              🔍
            </button>
            <button type="button" onClick={() => navigate("/profile")} className="text-[13px] hover:text-white">
              👤
            </button>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.9fr_1fr]">
          <aside className="space-y-4">
            <article
              className="overflow-hidden rounded-[18px] border border-white/5 bg-[#1d2027] shadow-[0_16px_32px_rgba(0,0,0,0.35)] cursor-pointer transition hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              onClick={() => navigate("/profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/profile")}
              aria-label="Lihat halaman profil"
            >
              <div className="h-[90px] bg-gradient-to-r from-[#0f1118] via-[#2c2f3a] to-[#11131b]" />
              <div className="relative px-4 pb-4">
                <img
                  src={profilePhoto}
                  alt="Foto profil"
                  className="absolute -top-10 h-20 w-20 rounded-full border-[3px] border-[#1d2027] object-cover"
                />
                <div className="pt-12">
                  <h2 className="text-[20px] font-semibold leading-tight text-white">
                    Salman Falah Taqiyu...
                  </h2>
                  <p className="mt-1 text-[13px] text-[#aeb4c2]">
                    Aspiring Mobile App Developer | Transforming Ideas into Reality wit...
                  </p>
                  <p className="mt-1 text-[11px] text-[#8b92a1]">Kota Malang, Jawa Timur</p>
                  <button
                    type="button"
                    onClick={handlePlaceholder}
                    className="mt-3 h-9 w-full rounded-[10px] border border-[#4b5160] text-left text-[13px] text-[#cfd4df] transition hover:border-[#6d7588] hover:text-white"
                  >
                    <span className="pl-3">Pengalaman</span>
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-[18px] border border-white/5 bg-[#1d2027] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <button
                type="button"
                onClick={handlePlaceholder}
                className="mb-2 flex w-full items-center justify-between text-[12px] text-[#c9ced9] hover:text-white"
              >
                <span>Pengunjung profil</span>
                <span className="text-[#2f8fff]">4</span>
              </button>
              <button
                type="button"
                onClick={handlePlaceholder}
                className="flex w-full items-center justify-between text-[12px] text-[#c9ced9] hover:text-white"
              >
                <span>Tayangan posting</span>
                <span className="text-[#2f8fff]">5</span>
              </button>
            </article>

            <article className="rounded-[18px] border border-white/5 bg-[#1d2027] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <ul className="space-y-2 text-[12px] text-[#c5cad6]">
                {leftShortcuts.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={handlePlaceholder}
                      className="flex w-full items-center gap-2 hover:text-white"
                    >
                      <span className="opacity-75">■</span>
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          </aside>

          <section className="space-y-4">
            <article className="rounded-[18px] border border-white/5 bg-[#1d2027] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <div className="mb-3 flex items-center gap-3">
                <img src={profilePhoto} alt="Foto profil kecil" className="h-10 w-10 rounded-full object-cover" />
                <button
                  type="button"
                  onClick={handlePlaceholder}
                  className="h-10 flex-1 rounded-full border border-[#4d5361] px-4 text-left text-[13px] text-[#9ca4b4] hover:border-[#697187] hover:text-[#cfd5e2]"
                >
                  Mulai buat posting
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[16px] text-[#c9ceda]">
                {postActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={handlePlaceholder}
                    className="rounded-[10px] py-2 transition hover:bg-[#252a35]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[18px] border border-white/5 bg-[#1d2027] shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[10px] font-bold text-[#2a2d35]">
                    Tencent
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#dce2ee]">Tencent</p>
                    <p className="text-[11px] text-[#8d94a4]">17.43 • sponsored</p>
                  </div>
                </div>
                <button type="button" onClick={handlePlaceholder} className="text-[14px] text-[#1f8bff] hover:text-[#64aeff]">
                  + Ikuti
                </button>
              </div>

              <p className="px-4 pb-3 text-[13px] leading-relaxed text-[#c2c8d5]">
                Global Campus Recruitment 2026 is now open to students graduating between January this year and
                December 2027 ...selengkapnya
              </p>

              <img src={posterImage} alt="Poster Campus Recruitment" className="w-full object-cover" />

              <div className="grid grid-cols-4 border-t border-white/5 p-3">
                {postFooter.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={handlePlaceholder}
                    className="rounded-[8px] py-2 text-[15px] text-[#aeb6c6] transition hover:bg-[#252a35] hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-4">
            <article className="rounded-[18px] border border-white/5 bg-[#1d2027] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <h3 className="text-[30px] font-semibold leading-none text-[#d9deea]">Berita</h3>
              <p className="mt-1 text-[12px] text-[#8d94a4]">Berita Utama</p>
              <div className="mt-4 space-y-3">
                {rightNews.map((news, index) => (
                  <button
                    key={`${news.title}-${index}`}
                    type="button"
                    onClick={handlePlaceholder}
                    className="block w-full text-left text-[12px] text-[#c2c9d7] hover:text-white"
                  >
                    <p className="leading-relaxed">{news.title}</p>
                    <p className="mt-1 text-[10px] text-[#8a909e]">{news.snippet}</p>
                    <p className="mt-1 text-[10px] text-[#7f8798]">
                      {news.time} • {news.views}
                    </p>
                  </button>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[18px] border border-white/5 bg-[#1d2027] shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
              <div className="p-4">
                <p className="text-[16px] font-semibold text-[#dce2ef]">Temukan jalur karirmu, sekarang!</p>
                <button
                  type="button"
                  onClick={handlePlaceholder}
                  className="mt-3 rounded-full bg-[#1284ff] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#3798ff]"
                >
                  Jelajahi Karir
                </button>
              </div>
              <img src={careerImage} alt="Banner karir" className="w-full object-cover" />
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
