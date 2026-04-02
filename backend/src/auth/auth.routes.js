import express from "express";
import AuthController from "./auth.controller.js";

const route = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user / make a account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
route.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authorization for user / login API
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: LogIn Successfully
 */
route.post("/login", AuthController.login);

export default route;
