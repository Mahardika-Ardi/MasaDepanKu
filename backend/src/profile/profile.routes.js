import express from "express";
import ProfileController from "./profile.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import roleCheck from "../middlewares/role.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /profile/getSpecific:
 *   get:
 *     summary: Get specific profile (based on authenticated user)
 *     tags: [Profile]
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
route.get(
  "/getSpecific",
  verifyMiddleware,
  roleCheck("USER", "ADMIN"),
  ProfileController.findone,
);

route.patch(
  "/updateProfile",
  verifyMiddleware,
  roleCheck("USER", "ADMIN"),
  ProfileController.update,
);

export default route;
