import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImage from "../assets/profile/photo_profile.png";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

async function parseResponse(response) {
  const raw = await response.text();

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;

    async function loadProfileData() {
      setLoading(true);
      setError("");

      try {
        const [analysisResponse, answersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/analysis/latest`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/useranswer/latest`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const analysisData = await parseResponse(analysisResponse);
        const answersData = await parseResponse(answersResponse);

        if (!analysisResponse.ok || !analysisData?.Success) {
          throw new Error(analysisData?.Message || "Gagal memuat hasil analisis");
        }

        if (!answersResponse.ok || !answersData?.Success) {
          throw new Error(answersData?.Message || "Gagal memuat jawaban terakhir");
        }

        if (!isMounted) {
          return;
        }

        setAnalysis(analysisData.Information);
        setAnswers(answersData.Information);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Gagal memuat profil");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const summary = analysis?.analysis?.summary || "Belum ada hasil analisis yang tersimpan.";
  const jobs = analysis?.analysis?.recommended_jobs || [];
  const advices = analysis?.analysis?.actionable_advice || [];

  return (
    <main className="min-h-screen bg-[#191b22] px-4 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-white/8 bg-[#15171d] p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Profil Pengguna</p>
            <h1 className="mt-2 text-4xl font-semibold">Ringkasan Tes dan Aktivitas</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/beranda"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Beranda
            </Link>
            <Link
              to="/jelajah-karir"
              className="rounded-full bg-[#0c66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0]"
            >
              Ulang Tes
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-white/8 bg-[#15171d] p-6 text-[#b8bcc4]">
            Memuat profil...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[340px_1fr_1fr]">
            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6">
              <img
                src={profileImage}
                alt="Profil pengguna"
                className="mx-auto h-40 w-40 rounded-full border-4 border-white/10 object-cover"
              />
              <div className="mt-6 rounded-[20px] border border-white/10 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Sesi Aktif</p>
                <p className="mt-2 text-lg font-semibold text-white">Token Login Tersimpan</p>
                <p className="mt-2 text-sm text-[#b8bcc4]">
                  Token digunakan untuk mengakses halaman beranda, tes, dan hasil analisis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login", { replace: true });
                }}
                className="mt-5 w-full rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Logout
              </button>
            </section>

            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6">
              <h2 className="text-2xl font-semibold text-white">Hasil Tes Terakhir</h2>
              <div className="mt-5 rounded-[22px] border border-white/10 p-5">
                <p className="text-sky-400">Ringkasan:</p>
                <p className="mt-3 leading-7 text-[#d8dbe1]">{summary}</p>

                <p className="mt-6 text-sky-400">Jumlah jawaban tersimpan:</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {answers?.total_answers || 0}
                </p>

                <p className="mt-6 text-sky-400">Mode AI:</p>
                <p className="mt-2 text-[#d8dbe1]">
                  {analysis?.ai_enabled ? "AI aktif" : "Fallback analisis aktif"}
                </p>
              </div>
            </section>

            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6">
              <h2 className="text-2xl font-semibold text-white">Aksi Lanjutan</h2>
              <div className="mt-5 space-y-4">
                {advices.map((item, index) => (
                  <article key={item} className="rounded-[20px] border border-white/10 p-4">
                    <p className="text-lg font-semibold text-sky-400">{index + 1}. Saran</p>
                    <p className="mt-2 leading-6 text-[#d8dbe1]">{item}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[20px] border border-white/10 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Jobs</p>
                <div className="mt-3 space-y-3">
                  {jobs.map((job) => (
                    <div key={job.title} className="rounded-xl border border-white/10 p-3">
                      <p className="font-semibold text-white">{job.title}</p>
                      <p className="mt-1 text-sm text-[#b8bcc4]">{job.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;
