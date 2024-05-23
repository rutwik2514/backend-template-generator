const express = require("express");
const router = express.Router();
const {register,login} = require("../controllers/auth");

router.post("/auth/register",register);
module.exports = router;