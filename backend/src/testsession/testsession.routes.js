import express from "express";
import TestsessionController from "./testsession.controller.js";
import verifyMiddleware from "../middlewares/auth.js";
import ownerShipCheck from "../middlewares/ownership_check.js";

const route = express.Router();

/**
 * @swagger
 * /testsession/findTestSession:
 *   get:
 *     summary: Ambil sesi tes aktif milik user yang sedang login
 *     description: Mengembalikan sesi berstatus **PENDING** beserta daftar soal dan jawaban yang sudah tersimpan.
 *     tags: [TestSession]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil sesi tes aktif
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
 *                   example: "Sucessfully showing session"
 *                 Information:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     userId:
 *                       type: integer
 *                       example: 3
 *                     status:
 *                       type: string
 *                       example: PENDING
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-06T10:30:00.000Z"
 *                     question:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           number:
 *                             type: integer
 *                             example: 1
 *                           question:
 *                             type: string
 *                             example: "Saya nyaman bekerja dengan logika dan data."
 *                           category:
 *                             type: string
 *                             example: analitis
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 44
 *                           questionId:
 *                             type: integer
 *                             example: 101
 *                           value:
 *                             type: integer
 *                             example: 4
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Sesi tes aktif tidak ditemukan
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Gagal mengambil sesi tes
 */
route.get(
  "/findTestSession",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.find,
);

/**
 * @swagger
 * /testsession/finishTest:
 *   patch:
 *     summary: Menandai sesi tes user menjadi selesai
 *     description: Endpoint ini mengubah status sesi tes milik user yang login menjadi selesai.
 *     tags: [TestSession]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil menyelesaikan sesi tes
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
 *                   example: "Sucessfully finishing test session"
 *                 Information:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     userId:
 *                       type: integer
 *                       example: 3
 *                     status:
 *                       type: string
 *                       example: COMPLETED
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Sesi tes tidak ditemukan
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Gagal menyelesaikan sesi tes
 */
route.patch(
  "/finishTest",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.finish,
);

/**
 * @swagger
 * /testsession/cancelTest:
 *   patch:
 *     summary: Membatalkan sesi tes aktif
 *     description: Endpoint ini mengubah status sesi tes milik user yang login menjadi gagal/batal.
 *     tags: [TestSession]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil membatalkan sesi tes
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
 *                   example: "Sucessfully canceling test session"
 *                 Information:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     userId:
 *                       type: integer
 *                       example: 3
 *                     status:
 *                       type: string
 *                       example: FAILED
 *                 Error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Sesi tes tidak ditemukan
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Gagal membatalkan sesi tes
 */
route.patch(
  "/cancelTest",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.cancel,
);

export default route;
