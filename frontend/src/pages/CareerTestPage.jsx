import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const QUESTIONS_PER_PAGE = 4;

async function parseResponse(response) {
  const raw = await response.text();

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function CareerTestPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [groupQuestionId, setGroupQuestionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  }, [questions.length]);

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return questions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [questions, currentPage]);

  const allAnswered = useMemo(() => {
    return questions.length > 0 && questions.every((question) => answers[question.number]);
  }, [answers, questions]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;

    async function loadQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/question/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ total_questions: 20 }),
        });

        const data = await parseResponse(response);

        if (!response.ok || !data?.Success) {
          throw new Error(data?.Message || "Gagal memuat soal");
        }

        if (!isMounted) {
          return;
        }

        setQuestions(data?.Information?.question || []);
        setGroupQuestionId(data?.Information?.group_question_id || null);
        setCurrentPage(0);
        setAnswers({});
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Gagal memuat soal");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  const setAnswer = (questionNumber, value) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!groupQuestionId || !allAnswered) {
      setError("Pastikan semua pertanyaan sudah dijawab sebelum submit.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const submitResponse = await fetch(`${API_BASE_URL}/useranswer/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          group_question_id: groupQuestionId,
          answers: questions.map((question) => answers[question.number]),
        }),
      });

      const submitData = await parseResponse(submitResponse);

      if (!submitResponse.ok || !submitData?.Success) {
        throw new Error(submitData?.Message || "Gagal menyimpan jawaban");
      }

      const analysisResponse = await fetch(`${API_BASE_URL}/analysis/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ group_question_id: groupQuestionId }),
      });

      const analysisData = await parseResponse(analysisResponse);

      if (!analysisResponse.ok || !analysisData?.Success) {
        throw new Error(analysisData?.Message || "Gagal menghasilkan analisis");
      }

      setAnalysisResult(analysisData.Information);
    } catch (submitError) {
      setError(submitError.message || "Gagal submit jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#191b22] text-white">
        <p className="text-lg text-[#b8bcc4]">Memuat soal minat bakat...</p>
      </main>
    );
  }

  if (analysisResult) {
    const summary = analysisResult.analysis?.summary || "Hasil analisis belum tersedia.";
    const competency = analysisResult.analysis?.competency_analysis || {};
    const strengths = competency.strengths || [];
    const improvements = competency.areas_of_improvement || [];
    const jobs = analysisResult.analysis?.recommended_jobs || [];
    const advices = analysisResult.analysis?.actionable_advice || [];

    return (
      <main className="min-h-screen bg-[#191b22] px-4 py-8 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">
                Hasil Tes Minat Bakat
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Rekomendasi Karir</h1>
            </div>
            <div className="flex gap-3">
              <Link
                to="/beranda"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Kembali ke Beranda
              </Link>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-[#0c66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0]"
              >
                Ulang Tes
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr_1fr]">
            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
              <h2 className="text-2xl font-semibold text-white">Competency Analysis</h2>
              <div className="mt-5 rounded-[24px] border border-white/10 p-5">
                <p className="text-sky-400">Ringkasan:</p>
                <p className="mt-2 leading-7 text-[#d8dbe1]">{summary}</p>

                <p className="mt-6 text-sky-400">Strengths:</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-[#d8dbe1]">
                  {strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p className="mt-6 text-sky-400">Areas to Focus:</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-[#d8dbe1]">
                  {improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
              <h2 className="text-2xl font-semibold text-white">Recommended Jobs</h2>
              <div className="mt-5 space-y-4">
                {jobs.map((job) => (
                  <article key={job.title} className="rounded-[20px] border border-white/10 p-4">
                    <p className="text-lg font-semibold text-sky-400">{job.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#d8dbe1]">{job.reason}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-white/8 bg-[#15171d] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
              <h2 className="text-2xl font-semibold text-white">Actionable Advice</h2>
              <div className="mt-5 space-y-4">
                {advices.map((advice, index) => (
                  <article key={advice} className="rounded-[20px] border border-white/10 p-4">
                    <p className="text-lg font-semibold text-sky-400">{index + 1}. Rekomendasi</p>
                    <p className="mt-2 leading-6 text-[#d8dbe1]">{advice}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#191b22] px-4 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[30px] border border-white/8 bg-[#15171d] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.4)] lg:p-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Tes Minat Bakat</p>
            <h1 className="mt-2 text-4xl font-semibold">Jelajah Karir</h1>
          </div>
          <Link
            to="/beranda"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Kembali
          </Link>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mb-6 flex items-center justify-between text-sm text-[#b8bcc4]">
          <p>
            Halaman {currentPage + 1} dari {totalPages}
          </p>
          <p>{questions.length} soal tersedia</p>
        </div>

        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <article key={question.id} className="rounded-[24px] border border-white/8 bg-[#1b1d24] p-5">
              <p className="text-lg font-semibold text-white">{question.question}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-teal-400">Tidak setuju</span>
                {[1, 2, 3, 4, 5].map((value) => {
                  const isActive = answers[question.number] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswer(question.number, value)}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
                        isActive
                          ? "border-sky-400 bg-sky-500/20 text-sky-300"
                          : "border-white/20 text-white/80 hover:border-sky-300/50 hover:text-white"
                      }`}
                      aria-label={`Jawaban ${value} untuk pertanyaan ${question.number}`}
                    >
                      {value}
                    </button>
                  );
                })}
                <span className="font-semibold text-violet-400">Setuju</span>
              </div>
              <p className="mt-3 text-sm text-[#9ea4ae]">
                {question.answer?.[answers[question.number] || 3] || "Pilih jawaban untuk melanjutkan"}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentPage === 0}
            className="rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-[#1f2128] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kembali
          </button>

          <div className="flex gap-3">
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0]"
              >
                Lanjutkan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Submit"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-[#9ea4ae]">
          Pastikan semua pertanyaan dijawab. Backend akan mengubah total soal secara dinamis, tetapi tetap menampilkan 4 soal per halaman.
        </p>
      </div>
    </main>
  );
}

export default CareerTestPage;
