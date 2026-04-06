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
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Santoso
 *               email:
 *                 type: string
 *                 format: email
 *                 example: budi@mail.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: Register berhasil
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
 *                   example: Register successfully
 *                 Information:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Budi Santoso
 *                     email:
 *                       type: string
 *                       example: budi@mail.com
 *                     role:
 *                       type: string
 *                       example: USER
 *                 Error:
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Register gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Success:
 *                   type: boolean
 *                   example: false
 *                 Message:
 *                   type: string
 *                   example: Error -> Failed to Register Users
 *                 Information:
 *                   nullable: true
 *                   example: null
 *                 Error:
 *                   type: string
 *                   example: BAD_REQUEST
 */
route.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user dan mendapatkan JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: budi@mail.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: LogIn Successfully
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
 *                   example: LogIn Successfully!
 *                 Information:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Budi Santoso
 *                     email:
 *                       type: string
 *                       example: budi@mail.com
 *                     role:
 *                       type: string
 *                       example: USER
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 Error:
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Login gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Success:
 *                   type: boolean
 *                   example: false
 *                 Message:
 *                   type: string
 *                   example: Error -> LogIn Failed!
 *                 Information:
 *                   nullable: true
 *                   example: null
 *                 Error:
 *                   type: string
 *                   example: BAD_REQUEST
 */
route.post("/login", AuthController.login);

export default route;
