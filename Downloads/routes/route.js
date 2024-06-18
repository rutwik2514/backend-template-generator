const express = require("express");
const router = express.Router();

// auth routes
const { register, login } = require("../controllers/auth");
const { checkAuthorizationHeaders, authorizeUser } = require("../middlewares/authenticate");


router.post("/register", register);
router.post("/login", checkAuthorizationHeaders, login);

    
// Nested routes
const { createNested, updateNested, deleteNested, getNested, getAllNested } = require('../controllers/nested');
// 
router.post("/nested/create", checkAuthorizationHeaders,authorizeUser("createNested") ,createNested);
router.put("/nested/update/:id", checkAuthorizationHeaders,authorizeUser("updateNested"), updateNested);
router.delete("/nested/delete/:id", checkAuthorizationHeaders, authorizeUser("deleteNested"), deleteNested);
router.get("/nested/get/:id", checkAuthorizationHeaders, authorizeUser("readNested"), getNested);
router.get("/nested/getAll", checkAuthorizationHeaders, authorizeUser("readNested"), getAllNested);

  
module.exports = router;
