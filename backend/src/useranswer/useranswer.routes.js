import express from "express";
import UseranswerController from "./useranswer.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /useranswer/createAnswer:
 *   post:
 *     summary: Simpan atau update jawaban user untuk satu soal
 *     description: |
 *       Endpoint ini menyimpan jawaban berdasarkan kombinasi `sessionId` dan `questionId`.
 *       Jika jawaban untuk kombinasi tersebut sudah ada, nilainya akan di-update.
 *     tags: [UserAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: integer
 *                 example: 12
 *                 description: ID sesi tes aktif
 *               questionId:
 *                 type: integer
 *                 example: 101
 *                 description: ID pertanyaan yang dijawab
 *               value:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *                 description: Skor jawaban user (skala 1-5)
 *             required:
 *               - value
 *           examples:
 *             submitAnswer:
 *               summary: Contoh payload submit jawaban
 *               value:
 *                 sessionId: 12
 *                 questionId: 101
 *                 value: 4
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
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
 *                   example: "Successfully submit answer"
 *                 Information:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 77
 *                     sessionId:
 *                       type: integer
 *                       example: 12
 *                     questionId:
 *                       type: integer
 *                       example: 101
 *                     value:
 *                       type: integer
 *                       example: 4
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Payload tidak valid
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Gagal menyimpan jawaban
 */
route.post(
  "/createAnswer",
  verifyMiddleware,
  ownerShipCheck,
  UseranswerController.create,
);

/**
 * @swagger
 * /useranswer/createAnswer:
 *   get:
 *     summary: Ambil seluruh jawaban user pada sesi tes
 *     description: Mengembalikan daftar jawaban user beserta detail pertanyaan terkait.
 *     tags: [UserAnswer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar jawaban
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
 *                   example: "Succesfully showing question"
 *                 Information:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 77
 *                       sessionId:
 *                         type: integer
 *                         example: 12
 *                       questionId:
 *                         type: integer
 *                         example: 101
 *                       value:
 *                         type: integer
 *                         example: 4
 *                       question:
 *                         type: object
 *                         properties:
 *                           number:
 *                             type: integer
 *                             example: 1
 *                           question:
 *                             type: string
 *                             example: "Saya nyaman bekerja dengan logika dan data."
 *                           answer:
 *                             type: object
 *                             nullable: true
 *                           category:
 *                             type: string
 *                             example: analitis
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Jawaban tidak ditemukan
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Gagal mengambil daftar jawaban
 */
route.get(
  "/createAnswer",
  verifyMiddleware,
  ownerShipCheck,
  UseranswerController.findall,
);

export default route;
