import express from "express";
import QuestionController from "./question.controller.js";
import verifyMiddleware from "../middlewares/auth.js";

const route = express.Router();

/**
 * @swagger
 * /question/create:
 *   post:
 *     summary: Generate 20 soal minat bakat menggunakan AI dan simpan ke database
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Soal berhasil di-generate dan disimpan
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
 *                   example: Successfully Get User Data!
 *                 Information:
 *                   type: object
 *                   properties:
 *                     generated_by:
 *                       type: integer
 *                       example: 1
 *                     group_question_id:
 *                       type: integer
 *                       example: 10
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
 *                             example: Saya senang memperbaiki atau merakit benda-benda.
 *                           category:
 *                             type: string
 *                             enum: [teknis, sosial, kreatif, analitis, manajerial]
 *                           answer:
 *                             type: object
 *                             properties:
 *                               "1":
 *                                 type: string
 *                                 example: Sangat Tidak Setuju
 *                               "2":
 *                                 type: string
 *                                 example: Tidak Setuju
 *                               "3":
 *                                 type: string
 *                                 example: Netral
 *                               "4":
 *                                 type: string
 *                                 example: Setuju
 *                               "5":
 *                                 type: string
 *                                 example: Sangat Setuju
 *                           group_id:
 *                             type: integer
 *                             example: 10
 *                 Error:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Gagal generate/simpan soal
 */
route.post("/create", verifyMiddleware, QuestionController.create);

export default route;
