const express = require("express");
const { checkAuthorizationHeaders } = require("../middlewares/authenticate");
const { newProject, deleteProject, getAllProjects, getProjectInfo, addPermission, deletePermission, getAllPermisisons, addRole, deleteRole } = require("../controller/project");
const router = express.Router();


router.post("/new", checkAuthorizationHeaders,newProject)
router.delete("/delete/:projectId", checkAuthorizationHeaders,deleteProject)
router.get("/getAll", checkAuthorizationHeaders,getAllProjects)
router.get("/getProjectInfo/:projectId", checkAuthorizationHeaders,getProjectInfo)
router.post("/addPermissions/:projectId", checkAuthorizationHeaders,addPermission)
router.delete("/deletePermission/:projectId", checkAuthorizationHeaders,deletePermission)
router.get("/getPermissions/:projectId", checkAuthorizationHeaders,getAllPermisisons)
router.post("/addRole/:projectId", checkAuthorizationHeaders,addRole)
router.delete("/deleteRole/:projectId", checkAuthorizationHeaders,deleteRole)





module.exports = router;