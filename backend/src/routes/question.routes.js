import express from "express";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import QuestionController from "../controller/question.controller.js";

const route = express.Router();

/**
 * @swagger
 * /question/create:
 *   post:
 *     summary: Creating question using AI
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Success
 */
route.post("/question/create", verifyMiddleware, QuestionController.create);

export default route;
