const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");

router.post("/", authController.signUpUser);
router.post("/verify", authController.verifyEmail);

module.exports = router;
