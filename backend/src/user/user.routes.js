import express from "express";
import UserController from "./user.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import roleCheck from "../middlewares/role.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /users/getUsers:
 *   get:
 *     summary: Ambil semua user (pagination)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar user
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
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Budi Santoso
 *                           email:
 *                             type: string
 *                             example: budi@mail.com
 *                           role:
 *                             type: string
 *                             example: USER
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                 Error:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (hanya ADMIN)
 *       500:
 *         description: Gagal mengambil data user
 */
route.get(
  "/getUsers",
  verifyMiddleware,
  roleCheck("ADMIN"),
  UserController.findall,
);

/**
 * @swagger
 * /users/getSpecificUser:
 *   get:
 *     summary: Ambil 1 user berdasarkan filter name/email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter berdasarkan email
 *     responses:
 *       200:
 *         description: Berhasil mengambil user
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Gagal mengambil data user
 */
route.get(
  "/getSpecificUser",
  verifyMiddleware,
  roleCheck("ADMIN", "USER"),
  UserController.findone,
);

/**
 * @swagger
 * /users/updateUsers/{id}:
 *   patch:
 *     summary: Update data user berdasarkan path id (umumnya untuk ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID target
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@email.com
 *     responses:
 *       201:
 *         description: User berhasil diupdate
 *       400:
 *         description: ID path tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Gagal update user
 */
route.patch(
  "/updateUsers",
  verifyMiddleware,
  ownerShipCheck,
  roleCheck("ADMIN", "USER"),
  UserController.update,
);

/**
 * @swagger
 * /users/deleteUser:
 *   delete:
 *     summary: Hapus akun user login (tanpa path id)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User berhasil dihapus
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
 *                   nullable: true
 *                   example: null
 *                 Error:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Gagal menghapus user
 */
route.delete(
  "/deleteUser",
  verifyMiddleware,
  ownerShipCheck,
  roleCheck("ADMIN", "USER"),
  UserController.delete,
);

export default route;
