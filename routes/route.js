const express = require("express");
const router = express.Router();

const {checkAuthorizationHeaders} = require("../middlewares/authenticate");
const {newRole, deleteRole, updateRole, getRoles } = require("../controllers/role");

router.post("/new/:projectId", checkAuthorizationHeaders, newRole)
router.delete("/deleteRole",checkAuthorizationHeaders,deleteRole)
router.patch("/update",checkAuthorizationHeaders,updateRole)
router.post("/getRoles",checkAuthorizationHeaders,getRoles)


module.exports=router