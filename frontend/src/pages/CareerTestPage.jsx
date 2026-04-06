import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const QUESTIONS_PER_PAGE = 4;

const CATEGORY_LABELS = {
  teknis: "Teknis",
  sosial: "Sosial",
  kreatif: "Kreatif",
  analitis: "Analitis",
  manajerial: "Manajerial",
};

const CATEGORY_JOBS = {
  teknis: ["Software Engineer", "IT Support Specialist", "QA Engineer"],
  sosial: ["HR Officer", "Customer Success Associate", "Konselor"],
  kreatif: ["UI/UX Designer", "Content Creator", "Brand Designer"],
  analitis: ["Data Analyst", "Business Analyst", "Research Assistant"],
  manajerial: ["Project Coordinator", "Product Owner", "Operations Supervisor"],
};

async function parseResponse(response) {
  const raw = await response.text();

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildDummyAnalysis(questions, answers) {
  const scoreByCategory = {
    teknis: 0,
    sosial: 0,
    kreatif: 0,
    analitis: 0,
    manajerial: 0,
  };

  questions.forEach((question) => {
    const score = Number(answers[question.number] || 0);
    scoreByCategory[question.category] += score;
  });

  const sortedCategories = Object.entries(scoreByCategory).sort(
    (left, right) => right[1] - left[1],
  );
  const topCategory = sortedCategories[0]?.[0] || "analitis";
  const secondCategory = sortedCategories[1]?.[0] || "teknis";
  const lowestCategory = sortedCategories[sortedCategories.length - 1]?.[0] || "sosial";

  const recommendedJobs = [
    ...(CATEGORY_JOBS[topCategory] || []),
    ...(CATEGORY_JOBS[secondCategory] || []),
  ]
    .slice(0, 4)
    .map((title) => ({
      title,
      reason: `Kecenderungan Anda cukup kuat pada area ${CATEGORY_LABELS[topCategory]} dan ${CATEGORY_LABELS[secondCategory]}.`,
    }));

  return {
    generated_by: "dummy-result",
    group_question_id: null,
    total_questions: questions.length,
    ai_enabled: false,
    scores: scoreByCategory,
    analysis: {
      summary: `Berdasarkan jawaban Anda, kecenderungan terkuat ada pada area ${CATEGORY_LABELS[topCategory]} dan ${CATEGORY_LABELS[secondCategory]}. Ini menunjukkan Anda cocok pada peran yang membutuhkan kombinasi kekuatan tersebut.`,
      competency_analysis: {
        strengths: [
          `Kecenderungan ${CATEGORY_LABELS[topCategory]} cukup menonjol.`,
          `Kecenderungan ${CATEGORY_LABELS[secondCategory]} mendukung pilihan karier Anda.`,
        ],
        areas_of_improvement: [
          `Perlu menyeimbangkan area ${CATEGORY_LABELS[lowestCategory]} agar profil Anda lebih lengkap.`,
          "Perlu melatih konsistensi dalam menjawab tantangan yang kompleks.",
        ],
      },
      recommended_jobs: recommendedJobs,
      actionable_advice: [
        `Ikuti kursus atau pelatihan yang relevan dengan area ${CATEGORY_LABELS[topCategory]}.`,
        "Bangun portofolio sederhana dari proyek nyata.",
        "Cari komunitas atau mentor untuk memperkuat arah karier Anda.",
      ],
    },
  };
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

  const currentPageAnswered = useMemo(() => {
    return (
      currentQuestions.length > 0
      && currentQuestions.every((question) => answers[question.number])
    );
  }, [answers, currentQuestions]);

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
    setError("");
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  };

  const handleNext = () => {
    if (!currentPageAnswered) {
      setError("Jawab semua pertanyaan di halaman ini sebelum lanjut.");
      return;
    }

    setError("");
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleBack = () => {
    setError("");
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
      setAnalysisResult(buildDummyAnalysis(questions, answers));
    } catch (submitError) {
      setError(submitError.message || "Gagal menampilkan hasil");
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
                disabled={!currentPageAnswered}
                className="rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lanjutkan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !allAnswered}
                className="rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Submit"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-[#9ea4ae]">
          Pastikan semua pertanyaan dijawab sebelum submit.
        </p>
      </div>
    </main>
  );
}

export default CareerTestPage;
