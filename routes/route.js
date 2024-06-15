const express = require("express");
const router = express.Router();

const {checkAuthorizationHeaders} = require("../middlewares/authenticate");
const {newRole, deleteRole, updateRole } = require("../controllers/role");

router.post("/new", checkAuthorizationHeaders, newRole)
router.delete("/deleteRole",checkAuthorizationHeaders,deleteRole)
router.patch("/update",checkAuthorizationHeaders,updateRole)

module.exports=router