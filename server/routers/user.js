const express = require('express');
const router = express.Router();
const authenController = require("../controllers/authenController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/register", authenController.register);
router.post("/login", authenController.login);

router.get('/profile', isAuthenticated, authenController.profile)

router.get('/logout', authenController.logout);

module.exports = router;