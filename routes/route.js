const express = require('express')
const router = express.Router()

const {register,login, fetchUser, addProject, deleteProject} = require("../controllers/auth");
const {checkAuthorizationHeaders} = require("../middlewares/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/fetchUser", checkAuthorizationHeaders, fetchUser);
router.post("/addProject", checkAuthorizationHeaders, addProject);
router.delete("/deleteProject", checkAuthorizationHeaders,deleteProject)
module.exports = router
