import express from "express";
import ProfileController from "./profile.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";
import roleCheck from "../middlewares/role.middleware.js";
import { uploadSingleImageCloudinary } from "../middlewares/upload.middleware.js";

const route = express.Router();

/**
 * @swagger
 * /profile/getSpecificProfile:
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
  "/getSpecificProfile",
  verifyMiddleware,
  ownerShipCheck,
  ProfileController.findone,
);

/**
 * @swagger
 * /profile/updateProfile:
 *   patch:
 *     summary: Update profile with image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               jurusan:
 *                 type: string
 *                 example: "TKJ"
 *               raport:
 *                 type: object
 *                 properties:
 *                   BI:
 *                    type: number
 *                    example: 98
 *                   MTK:
 *                    type: number
 *                    example: 98
 *                   Bing:
 *                    type: number
 *                    example: 98
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success update profile
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
 *                   example: "Profile updated"
 *                 Information:
 *                   type: object
 *                 Error:
 *                   type: string
 *                   example: null
 */
route.patch(
  "/updateProfile",
  verifyMiddleware,
  ownerShipCheck,
  roleCheck("USER"),
  uploadSingleImageCloudinary,
  ProfileController.update,
);

export default route;
