// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware.verifyToken, authController.getProfile);
module.exports = router;
