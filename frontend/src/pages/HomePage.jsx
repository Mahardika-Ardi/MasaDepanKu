import { Link, useNavigate } from "react-router-dom";
import profilePreview from "../assets/beranda/photo_profile.png";
import aptitudePreview from "../assets/beranda/ilustrasi_minat_bakat.png";
import jobPreview from "../assets/beranda/rekomendasi_kampus.png";

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#191b22] text-[#f2f2f2]">
      <header className="border-b border-white/5 bg-[#1f2128]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">
              MasaDepanKu
            </p>
            <h1 className="text-lg font-semibold text-white">Dashboard Karier</h1>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-[#d4d7dd] md:flex">
            <a href="#fitur" className="transition hover:text-white">
              Fitur
            </a>
            <a href="#alur" className="transition hover:text-white">
              Alur Tes
            </a>
            <Link to="/profile" className="transition hover:text-white">
              Profil
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#f5f5f5] transition hover:border-white/25 hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/8 bg-[#15171d] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="mb-4 inline-flex rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
              Jelajah karir, mulai dari tes minat bakat
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white lg:text-6xl">
              Temukan arah karier yang paling cocok untukmu.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#b2b6bf] lg:text-lg">
              Coba tes minat bakat, lihat hasil analisis, lalu lanjutkan ke
              rekomendasi karier yang sesuai dengan profilmu.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/jelajah-karir"
                className="inline-flex items-center justify-center rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0]"
              >
                Mulai Tes Minat Bakat
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Lihat Hasil Terakhir
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#15171d] shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <img src={aptitudePreview} alt="Tes minat bakat" className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-lg font-semibold text-white">Tes Minat Bakat</p>
                <p className="mt-2 text-sm text-[#aeb4be]">
                  20 soal, 4 soal per halaman, hasil langsung dikirim ke backend.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#15171d] shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <img src={jobPreview} alt="Rekomendasi karier" className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-lg font-semibold text-white">Rekomendasi Karier</p>
                <p className="mt-2 text-sm text-[#aeb4be]">
                  Analisis akan menampilkan ringkasan, job rekomendasi, dan advice.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#15171d] shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <img src={profilePreview} alt="Profil pengguna" className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-lg font-semibold text-white">Profil Pengguna</p>
                <p className="mt-2 text-sm text-[#aeb4be]">
                  Simpan token saat login, lalu akses halaman yang dilindungi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto grid max-w-7xl gap-5 px-4 pb-10 lg:grid-cols-3 lg:px-8">
        <article className="rounded-[24px] border border-white/8 bg-[#15171d] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-400">01</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Tes dinamis</h3>
          <p className="mt-3 text-sm leading-6 text-[#b2b6bf]">
            Backend menentukan total soal, frontend membaginya menjadi 4 soal per halaman.
          </p>
        </article>
        <article className="rounded-[24px] border border-white/8 bg-[#15171d] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-400">02</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Analisis otomatis</h3>
          <p className="mt-3 text-sm leading-6 text-[#b2b6bf]">
            Hasil diproses oleh backend dan tetap punya fallback jika AI gagal.
          </p>
        </article>
        <article className="rounded-[24px] border border-white/8 bg-[#15171d] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-400">03</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Akses aman</h3>
          <p className="mt-3 text-sm leading-6 text-[#b2b6bf]">
            Halaman utama, tes, dan profil hanya bisa diakses setelah login.
          </p>
        </article>
      </section>
    </main>
  );
}

export default HomePage;
