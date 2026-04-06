import express from "express";
import UserController from "./user.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import roleCheck from "../middlewares/role.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     summary: Get users with pagination system
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Success
 */
route.get(
  "/getUsers",
  verifyMiddleware,
  roleCheck("ADMIN"),
  UserController.findall,
);

/**
 * @swagger
 * /user/getSpecificUser:
 *   get:
 *     summary: Get specific users with filter systems
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: example
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           example: example@gmail.com
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
route.get(
  "/getSpecificUser",
  verifyMiddleware,
  roleCheck("ADMIN", "USER"),
  UserController.findone,
);

/**
 * @swagger
 * /user/updateUsers:
 *   patch:
 *     summary: Update user data from aplication
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
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
 * /user/deleteUser:
 *   delete:
 *     summary: Delete users data from application
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
route.delete(
  "/deleteUser",
  verifyMiddleware,
  ownerShipCheck,
  roleCheck("ADMIN", "USER"),
  UserController.delete,
);

export default route;
