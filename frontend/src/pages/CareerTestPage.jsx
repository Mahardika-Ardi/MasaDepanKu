import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/apiBaseUrl";

const QUESTIONS_PER_PAGE = 4;

async function parseResponse(response) {
  const raw = await response.text();

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractApiMessage(payload, fallbackMessage) {
  return payload?.Message || payload?.message || fallbackMessage;
}

function parseProviderError(rawMessage) {
  if (!rawMessage) {
    return null;
  }

  try {
    const parsed = JSON.parse(String(rawMessage));
    const error = parsed?.error;

    if (!error || typeof error !== "object") {
      return null;
    }

    return {
      code: error.code,
      status: error.status,
      message: error.message,
    };
  } catch {
    return null;
  }
}

function formatErrorMessage(rawMessage, httpStatus) {
  const fallback = "Terjadi kendala saat memproses tes.";
  const baseMessage = rawMessage ? String(rawMessage) : fallback;
  const provider = parseProviderError(baseMessage);

  if (provider) {
    const providerLabel = [provider.status, provider.code]
      .filter((value) => value !== undefined && value !== null && String(value).length > 0)
      .join("/");
    const providerMessage = provider.message || "Provider AI tidak mengirim pesan detail.";

    if (providerLabel) {
      return `AI Provider (${providerLabel}): ${providerMessage}`;
    }

    return `AI Provider: ${providerMessage}`;
  }

  if (httpStatus) {
    return `HTTP ${httpStatus}: ${baseMessage}`;
  }

  return baseMessage;
}

function createApiError(response, payload, fallbackMessage) {
  const rawMessage = extractApiMessage(payload, fallbackMessage);
  const httpStatus = response?.status || null;
  const error = new Error(formatErrorMessage(rawMessage, httpStatus));

  error.rawMessage = rawMessage;
  error.httpStatus = httpStatus;

  return error;
}

function isValidAnswer(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function normalizeAnalysisPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  if (payload.analysis && typeof payload.analysis === "object") {
    return payload.analysis;
  }

  return payload;
}

function isAiCapacityError(rawMessage, httpStatus = null) {
  const provider = parseProviderError(rawMessage);

  if (!provider) {
    return false;
  }

  const providerCode = Number(provider.code);
  const providerStatus = String(provider.status || "").toUpperCase();

  return (
    providerCode === 429
    || providerCode === 503
    || providerStatus === "UNAVAILABLE"
    || providerStatus === "RESOURCE_EXHAUSTED"
    || httpStatus === 429
    || httpStatus === 503
  );
}

async function requestWithAiRetry(url, options, fallbackMessage, maxAttempts = 3) {
  let lastResponse = null;
  let lastData = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(url, options);
    const data = await parseResponse(response);

    lastResponse = response;
    lastData = data;

    if (response.ok && data?.Success) {
      return { response, data };
    }

    const message = extractApiMessage(data, fallbackMessage);
    const shouldRetry =
      isAiCapacityError(message, response.status);

    if (!shouldRetry || attempt === maxAttempts) {
      return { response, data };
    }

    await wait(700 * 2 ** (attempt - 1));
  }

  return { response: lastResponse, data: lastData };
}

function buildSampleAnalysisResult() {
  return {
    summary:
      "Ini adalah hasil simulasi untuk pratinjau tampilan karena layanan AI sedang sibuk. Berdasarkan kecenderungan jawaban, kamu menunjukkan potensi pada peran yang memadukan analisis, komunikasi, dan eksekusi terstruktur.",
    competency_analysis: {
      strengths: [
        "Mampu memahami pola masalah dengan cukup sistematis.",
        "Memiliki kemauan belajar yang baik untuk meningkatkan skill teknis.",
      ],
      areas_of_improvement: [
        "Perlu meningkatkan konsistensi dalam pengambilan keputusan berbasis data.",
        "Perlu memperkuat prioritas kerja saat menghadapi beberapa tugas sekaligus.",
      ],
    },
    recommended_jobs: [
      {
        title: "Data Analyst Junior",
        reason:
          "Cocok untuk profil yang suka menganalisis informasi dan menarik insight untuk pengambilan keputusan.",
        roadmap_reference_url: "https://roadmap.sh/data-analyst",
      },
      {
        title: "Business Operations Associate",
        reason:
          "Sesuai untuk kemampuan koordinasi, eksekusi, dan perbaikan proses kerja secara bertahap.",
        roadmap_reference_url: "https://roadmap.sh/product-manager",
      },
    ],
    actionable_advice: [
      "Mulai dari satu proyek mini analisis data dan publikasikan hasilnya sebagai portofolio.",
      "Bangun kebiasaan evaluasi mingguan untuk melihat progres skill dan target belajar.",
      "Latih komunikasi insight secara ringkas agar hasil analisismu mudah dipahami tim.",
    ],
  };
}

function CareerTestPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [groupQuestionId, setGroupQuestionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSampleResult, setIsSampleResult] = useState(false);
  const [canPreviewSampleResult, setCanPreviewSampleResult] = useState(false);
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);

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
      && currentQuestions.every((question) => isValidAnswer(answers[question.id]))
    );
  }, [answers, currentQuestions]);

  const allAnswered = useMemo(() => {
    return questions.length > 0 && questions.every((question) => isValidAnswer(answers[question.id]));
  }, [answers, questions]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  const handleGenerateQuestions = async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { response, data } = await requestWithAiRetry(
        `${API_BASE_URL}/question/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ total_questions: 20 }),
        },
        "Gagal memuat soal",
      );

      if (!response.ok || !data?.Success) {
        throw createApiError(response, data, "Gagal memuat soal");
      }

      const information = data?.Information || {};

      setQuestions(Array.isArray(information.question) ? information.question : []);
      setGroupQuestionId(
        information.group_question_id
        || information.groupQuestionId
        || information.id
        || null,
      );
      setCurrentPage(0);
      setAnswers({});
      setCanPreviewSampleResult(false);
      setIsSampleResult(false);
      setHasGeneratedQuestions(true);
    } catch (loadError) {
      const rawMessage = loadError?.rawMessage || loadError?.message;
      const httpStatus = loadError?.httpStatus || null;

      setError(loadError?.message || formatErrorMessage(rawMessage, httpStatus));
      setCanPreviewSampleResult(isAiCapacityError(rawMessage, httpStatus));
      setHasGeneratedQuestions(false);
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (questionId, value) => {
    setError("");
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

  const handlePreviewSampleResult = () => {
    setError("");
    setAnalysisResult(buildSampleAnalysisResult());
    setIsSampleResult(true);
    setCanPreviewSampleResult(false);
  };

  const handleSubmit = async () => {
    if (!groupQuestionId) {
      setError("Sesi tes tidak ditemukan. Muat ulang halaman dan coba lagi.");
      return;
    }

    if (!allAnswered) {
      setError("Pastikan semua pertanyaan sudah dijawab sebelum submit.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const saveAnswerRequests = questions.map(async (question) => {
        const response = await fetch(`${API_BASE_URL}/useranswer/createAnswer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId: Number(groupQuestionId),
            questionId: Number(question.id),
            value: Number(answers[question.id]),
          }),
        });

        const data = await parseResponse(response);

        if (!response.ok || !data?.Success) {
          throw createApiError(response, data, `Gagal menyimpan jawaban nomor ${question.number}`);
        }
      });

      await Promise.all(saveAnswerRequests);

      const { response: analysisResponse, data: analysisData } = await requestWithAiRetry(
        `${API_BASE_URL}/analysis/analysisJawaban`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        },
        "Gagal memproses analisis",
      );

      if (!analysisResponse.ok || !analysisData?.Success) {
        throw createApiError(analysisResponse, analysisData, "Gagal memproses analisis");
      }

      if (!analysisData?.Information) {
        throw new Error("Hasil analisis belum tersedia dari server.");
      }

      setAnalysisResult(analysisData.Information);
      setIsSampleResult(false);
    } catch (submitError) {
      const rawMessage = submitError?.rawMessage || submitError?.message;
      const httpStatus = submitError?.httpStatus || null;

      setError(submitError?.message || formatErrorMessage(rawMessage, httpStatus));
      setCanPreviewSampleResult(isAiCapacityError(rawMessage, httpStatus));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#191b22] text-white">
        <p className="text-lg text-[#b8bcc4]">Menyiapkan soal minat bakat...</p>
      </main>
    );
  }

  if (analysisResult) {
    const analysis = normalizeAnalysisPayload(analysisResult);
    const summary = analysis.summary || "Hasil analisis belum tersedia.";
    const competency = analysis.competency_analysis || {};
    const strengths = competency.strengths || [];
    const improvements = competency.areas_of_improvement || [];
    const jobs = analysis.recommended_jobs || [];
    const advices = analysis.actionable_advice || [];

    return (
      <main className="min-h-screen bg-[#191b22] px-4 py-8 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">
                Hasil Tes Minat Bakat
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Rekomendasi Karir</h1>
              {isSampleResult ? (
                <p className="mt-3 inline-flex rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-[12px] font-semibold text-amber-200">
                  Mode Simulasi: hasil ini contoh tampilan saat layanan AI sedang sibuk
                </p>
              ) : null}
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
                    {job.roadmap_reference_url ? (
                      <a
                        href={job.roadmap_reference_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        Lihat roadmap pembelajaran
                      </a>
                    ) : null}
                  </article>
                ))}
                {jobs.length === 0 ? (
                  <p className="text-sm text-[#9ea4ae]">Belum ada rekomendasi pekerjaan dari analisis.</p>
                ) : null}
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
                {advices.length === 0 ? (
                  <p className="text-sm text-[#9ea4ae]">Belum ada saran tindak lanjut dari analisis.</p>
                ) : null}
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

        {canPreviewSampleResult ? (
          <div className="mb-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-4 text-sm text-amber-100">
            <p>Layanan AI sedang sibuk. Kamu tetap bisa lihat contoh tampilan hasil analisis sekarang.</p>
            <button
              type="button"
              onClick={handlePreviewSampleResult}
              className="mt-3 rounded-full bg-amber-300/90 px-4 py-2 text-[13px] font-semibold text-[#1f2128] transition hover:bg-amber-200"
            >
              Lihat Contoh Hasil Analisis
            </button>
          </div>
        ) : null}

        {!hasGeneratedQuestions ? (
          <div className="mb-6 rounded-[24px] border border-white/10 bg-[#1b1d24] px-5 py-7">
            <p className="text-sm text-[#c5cbd8]">
              Soal belum dibuat. Klik tombol di bawah untuk mulai generate soal tes minat dan bakat.
            </p>
            <button
              type="button"
              onClick={handleGenerateQuestions}
              className="mt-4 rounded-full bg-[#0c66c2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5ab0]"
            >
              Generate Soal
            </button>
          </div>
        ) : null}

        {hasGeneratedQuestions ? (
          <>

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
                      const isActive = answers[question.id] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAnswer(question.id, value)}
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
                    {question.answer?.[answers[question.id] || 3] || "Pilih jawaban untuk melanjutkan"}
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
          </>
        ) : null}
      </div>
    </main>
  );
}

export default CareerTestPage;
