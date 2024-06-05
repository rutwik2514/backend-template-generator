const express = require("express");
const router = express.Router();
const {register,login, fetchUser} = require("../controllers/auth");
const {checkAuthorizationHeaders} = require("../middlewares/authenticate");
const { newProject, addPermission, deletePermission, deleteProject, getAllProjects, getProjectInfo } = require("../controllers/project");
const {newRole, deleteRole, updateRole } = require("../controllers/role");

//auth routes
router.post("/auth/register",register);
router.post("/auth/login",login);
router.get("/auth/fetchUser",checkAuthorizationHeaders ,fetchUser);


//project routes
router.post("/project/new",checkAuthorizationHeaders, newProject);
router.post("/project/addPermission",checkAuthorizationHeaders,addPermission)
router.delete("/project/deletePermission",checkAuthorizationHeaders,deletePermission)
router.delete("/project/deleteProject",checkAuthorizationHeaders,deleteProject);
router.get("/project/getProjects", checkAuthorizationHeaders,getAllProjects)
router.get("/project/getProjectInfo/:projectId", checkAuthorizationHeaders,getProjectInfo);

//role routes
router.post("/role/new", checkAuthorizationHeaders, newRole)
router.delete("/role/deleteRole",checkAuthorizationHeaders,deleteRole)
router.patch("/role/update",checkAuthorizationHeaders,updateRole)



module.exports = router;