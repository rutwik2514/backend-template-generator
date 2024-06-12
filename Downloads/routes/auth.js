const express = require("express");
const { register, login } = require("../controllers/auth");
const { checkAuthorizationHeaders, authorizeUser } = require("../middlewares/authenticate");
const router = express.Router();


router.post("/register" , checkAuthorizationHeaders, register);
router.post("/login",login);


module.exports = router;

