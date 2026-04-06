import express from "express";
import QuestionController from "./question.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /question/create:
 *   post:
 *     summary: Creating question using AI
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
route.post("/create", verifyMiddleware, QuestionController.create);

export default route;
