const express = require('express')
const router = express.Router()

const {register,login, fetchUser} = require("../controllers/auth");
const {checkAuthorizationHeaders} = require("../middlewares/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/fetchUser", checkAuthorizationHeaders, fetchUser);

module.exports = router
