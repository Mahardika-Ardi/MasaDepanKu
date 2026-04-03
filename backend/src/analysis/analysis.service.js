import AiService from "../ai/service/ai.service.js";
import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

const categoryLabelMap = {
  teknis: "Teknis",
  sosial: "Sosial",
  kreatif: "Kreatif",
  analitis: "Analitis",
  manajerial: "Manajerial",
};

const categoryJobMap = {
  teknis: ["Software Engineer", "IT Support", "QA Engineer"],
  sosial: ["HR Specialist", "Customer Success", "Konselor Pendidikan"],
  kreatif: ["UI/UX Designer", "Content Creator", "Brand Designer"],
  analitis: ["Data Analyst", "Business Analyst", "Market Researcher"],
  manajerial: ["Project Coordinator", "Product Owner", "Operations Supervisor"],
};

function createEmptyScore() {
  return {
    teknis: 0,
    sosial: 0,
    kreatif: 0,
    analitis: 0,
    manajerial: 0,
  };
}

function sortScore(score) {
  return Object.entries(score).sort((a, b) => b[1] - a[1]);
}

class AnalysisService {
  buildFallback(score) {
    const sorted = sortScore(score);
    const topCategory = sorted[0]?.[0] || "analitis";
    const secondCategory = sorted[1]?.[0] || "teknis";
    const lowCategory = sorted[sorted.length - 1]?.[0] || "sosial";

    const recommendedJobs = [
      ...(categoryJobMap[topCategory] || []),
      ...(categoryJobMap[secondCategory] || []),
    ]
      .slice(0, 4)
      .map((title) => ({
        title,
        reason: `Karena kecenderungan ${categoryLabelMap[topCategory]} dan ${categoryLabelMap[secondCategory]} Anda cukup dominan dari hasil tes.`,
      }));

    return {
      summary: `Berdasarkan jawaban tes minat dan bakat, Anda menunjukkan kecenderungan kuat pada aspek ${categoryLabelMap[topCategory]} dan ${categoryLabelMap[secondCategory]}. Kombinasi ini menandakan potensi baik untuk peran yang membutuhkan kemampuan problem solving, adaptasi, dan eksekusi yang konsisten.`,
      competency_analysis: {
        strengths: [
          `Kemampuan ${categoryLabelMap[topCategory]} cukup menonjol`,
          `Kemampuan ${categoryLabelMap[secondCategory]} mendukung performa kerja`,
        ],
        areas_of_improvement: [
          `Perlu mengembangkan aspek ${categoryLabelMap[lowCategory]} agar lebih seimbang`,
          "Perlu meningkatkan komunikasi hasil kerja secara lebih terstruktur",
        ],
      },
      recommended_jobs: recommendedJobs,
      actionable_advice: [
        `Ikuti pelatihan atau kursus yang relevan dengan area ${categoryLabelMap[topCategory]}.`,
        "Bangun portofolio kecil dari proyek nyata untuk memperkuat profil Anda.",
        "Cari komunitas profesional agar mendapat insight karier dan peluang kerja.",
      ],
    };
  }

  async findQuestionGroup(userId, groupQuestionId) {
    if (groupQuestionId) {
      return prisma.groupQuestion.findFirst({
        where: {
          id: groupQuestionId,
          user_id: userId,
        },
      });
    }

    return prisma.groupQuestion.findFirst({
      where: { user_id: userId },
      orderBy: { id: "desc" },
    });
  }

  async generate(userId, data) {
    try {
      const questionGroup = await this.findQuestionGroup(
        userId,
        data.group_question_id,
      );

      if (!questionGroup) {
        throw {
          code: "NOT_FOUND",
          message: "Question group not found",
        };
      }

      const [profile, questions, answerGroup] = await prisma.$transaction([
        prisma.profilDetail.findFirst({ where: { user_id: userId } }),
        prisma.question.findMany({
          where: { group_id: questionGroup.id },
          orderBy: { number: "asc" },
        }),
        prisma.userAnswerGroup.findFirst({
          where: { user_id: userId },
          include: {
            userAnswers: {
              orderBy: { id: "asc" },
            },
          },
        }),
      ]);

      if (!questions.length) {
        throw {
          code: "NOT_FOUND",
          message: "No generated questions found",
        };
      }

      if (!answerGroup || !answerGroup.userAnswers.length) {
        throw {
          code: "BAD_REQUEST",
          message: "No submitted answers found",
        };
      }

      if (answerGroup.userAnswers.length !== questions.length) {
        throw {
          code: "BAD_REQUEST",
          message: "Total answers must match total questions",
        };
      }

      const scoreByCategory = questions.reduce((acc, question, index) => {
        const answerValue = answerGroup.userAnswers[index].value;
        acc[question.category] += answerValue;
        return acc;
      }, createEmptyScore());

      const answerPayload = questions.map((question, index) => {
        const answerValue = answerGroup.userAnswers[index].value;
        return {
          number: question.number,
          question: question.question,
          category: question.category,
          selected_value: answerValue,
          selected_label: question.answer?.[answerValue] || null,
        };
      });

      const scorePayload = {
        raport_score: profile?.raport_score || {},
        category_score: scoreByCategory,
      };

      let analysis;
      let aiEnabled = true;

      try {
        analysis = await AiService.AnalysisData(scorePayload, questions, answerPayload);
      } catch (error) {
        aiEnabled = false;
        analysis = this.buildFallback(scoreByCategory);
      }

      return {
        generated_by: userId,
        group_question_id: questionGroup.id,
        total_questions: questions.length,
        scores: scoreByCategory,
        ai_enabled: aiEnabled,
        analysis,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new AnalysisService();
