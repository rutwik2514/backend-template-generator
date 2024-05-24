const express = require("express");
const router = express.Router();
const {register,login, fetchUser} = require("../controllers/auth");
const {checkAuthorizationHeaders} = require("../middlewares/authenticate")
router.post("/auth/register",register);
router.post("/auth/login",login);
router.get("/auth/fetchUser",checkAuthorizationHeaders ,fetchUser);


module.exports = router;