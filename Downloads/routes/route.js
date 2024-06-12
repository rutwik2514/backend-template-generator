const express = require("express");
const router = express.Router();

// auth routes
const { register, login } = require("../controllers/auth");
const { checkAuthorizationHeaders, authorizeUser } = require("../middlewares/authenticate");


router.post("/register", register);
router.post("/login", checkAuthorizationHeaders, login);

    
// rutwik routes
const { createRutwik, updateRutwik, deleteRutwik, getRutwik, getAllRutwik } = require('../controllers/rutwik');

router.post("/rutwik/create", checkAuthorizationHeaders, createRutwik);
router.put("/rutwik/update/:id", checkAuthorizationHeaders, updateRutwik);
router.delete("/rutwik/delete/:id", checkAuthorizationHeaders, deleteRutwik);
router.get("/rutwik/get/:id", checkAuthorizationHeaders, getRutwik);
router.get("/rutwik/getAll", checkAuthorizationHeaders, getAllRutwik);

    
// finalCheck routes
const { createFinalCheck, updateFinalCheck, deleteFinalCheck, getFinalCheck, getAllFinalCheck } = require('../controllers/finalcheck');

router.post("/finalcheck/create", checkAuthorizationHeaders, createFinalCheck);
router.put("/finalcheck/update/:id", checkAuthorizationHeaders, updateFinalCheck);
router.delete("/finalcheck/delete/:id", checkAuthorizationHeaders, deleteFinalCheck);
router.get("/finalcheck/get/:id", checkAuthorizationHeaders, getFinalCheck);
router.get("/finalcheck/getAll", checkAuthorizationHeaders, getAllFinalCheck);

  
module.exports = router;
