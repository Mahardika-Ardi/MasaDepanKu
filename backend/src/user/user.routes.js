import express from "express";
import UserController from "./user.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import roleCheck from "../middlewares/role.middleware.js";
import ownerShipCheck from "../middlewares/ownershipe_check.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /users/getUsers:
 *   get:
 *     summary: Get users with pagination system
 *     tags: [Users]
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
  "/users/getUsers",
  verifyMiddleware,
  roleCheck("ADMIN"),
  UserController.findall,
);

/**
 * @swagger
 * /users/getSpecificUser:
 *   get:
 *     summary: Get specific users with filter systems
 *     tags: [Users]
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
 */
route.get(
  "/users/getSpecificUser",
  verifyMiddleware,
  roleCheck("ADMIN", "USER"),
  UserController.findone,
);

/**
 * @swagger
 * /users/updateUsers/{id}:
 *   patch:
 *     summary: Update user data from aplication
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
  "/users/updateUsers/:id",
  verifyMiddleware,
  roleCheck("ADMIN", "USER"),
  ownerShipCheck,
  UserController.update,
);

/**
 * @swagger
 * /users/deleteUser/{id}:
 *   delete:
 *     summary: Delete users data from application
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
route.delete(
  "/users/deleteUser/:id",
  verifyMiddleware,
  roleCheck("ADMIN", "USER"),
  ownerShipCheck,
  UserController.delete,
);

export default route;
