import express from "express";
import AnalysisController from "./analysis.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import ownerShipCheck from "../middlewares/ownershipe_check.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /analysis/analysisJawaban:
 *   post:
 *     summary: Analaysis jawabannn
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success get profile data
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
 *                   example: ""
 *                 Information:
 *                   type: object
 *                 Error:
 *                   type: string
 *                   example: null
 */
route.post(
  "/analysisJawaban",
  verifyMiddleware,
  ownerShipCheck,
  AnalysisController.analysis,
);

export default route;
