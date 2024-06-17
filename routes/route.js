const express = require("express");
const { checkAuthorizationHeaders } = require("../middlewares/authenticate");
const { createSchema, deleteSchema, updateSchema, getSchemas } = require("../controller/schema");
const router = express.Router();

router.post("/new/:projectId", checkAuthorizationHeaders,createSchema);
router.delete("/delete/:projectId/:schemaId", checkAuthorizationHeaders,deleteSchema);
router.patch("/update/:schemaId",checkAuthorizationHeaders,updateSchema)
router.post("/getSchemas", checkAuthorizationHeaders,getSchemas)

module.exports =router;