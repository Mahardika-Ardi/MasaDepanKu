import express from "express";
import AnalysisController from "./analysis.controller.js";
import verifyMiddleware from "../middlewares/auth.js";
import ownerShipCheck from "../middlewares/ownership_check.js";

const route = express.Router();

/**
 * @swagger
 * /analysis/analysisJawaban:
 *   post:
 *     summary: Analisis jawaban user untuk rekomendasi minat/karier
 *     description: Memproses data profil, soal, dan jawaban user lalu menghasilkan insight analisis berbasis AI.
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil menghasilkan analisis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Success:
 *                   type: boolean
 *                   example: true
 *                 Message:
 *                   type: string
 *                   example: "Successfully analiting user "
 *                 Information:
 *                   type: object
 *                   description: Output analisis AI (format bergantung prompt/schema AI yang aktif)
 *                   example:
 *                     result: "User menunjukkan kecenderungan kuat pada kategori analitis dan teknis."
 *                     recommendation:
 *                       - "Data Analyst"
 *                       - "Backend Developer"
 *                     next_step:
 *                       - "Perdalam SQL dan Python"
 *                       - "Bangun portofolio proyek data sederhana"
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid / tidak ada
 *       404:
 *         description: Data sesi/jawaban user tidak ditemukan
 *       500:
 *         description: Gagal melakukan analisis
 */
route.post(
  "/analysisJawaban",
  verifyMiddleware,
  ownerShipCheck,
  AnalysisController.analysis,
);

export default route;
