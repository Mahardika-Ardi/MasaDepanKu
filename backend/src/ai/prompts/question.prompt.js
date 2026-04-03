export function buildQuestionPrompt(totalQuestions = 20) {
  return `Kamu adalah AI yang bertugas membuat soal tes minat dan bakat.

Buatkan ${totalQuestions} pertanyaan untuk tes minat dan bakat (career interest test).

Aturan:
- Setiap pertanyaan harus jelas, singkat, dan mudah dipahami
- Fokus ke minat, preferensi, dan kecenderungan aktivitas seseorang
- Gunakan bahasa Indonesia yang formal tapi santai

Format output WAJIB seperti ini:

[
  {
    "category": salah satu dari ini (teknis, sosial, kreatif, analitis, manajerial),
    "question": "Saya menikmati bekerja dalam tim untuk menyelesaikan masalah",
    "number": 1-20,
    "answer": {
      "1": "Sangat Tidak Setuju",
      "2": "Tidak Setuju",
      "3": "Netral",
      "4": "Setuju",
      "5": "Sangat Setuju"
    }
  }
]

Ketentuan:
- Total ${totalQuestions} soal
- Setiap kategori memiliki 4 soal
- Semua soal berbeda
- Jangan tambahkan penjelasan di luar JSON
 - Output HARUS valid JSON`.trim();
}

