// Generated routes based on user input
const express = require('express');
const router = express.Router();
const {createRutwik, updateRutwik, deleteRutwik, getRutwik, getAllRutwik } = require('../controllers/rutwik');

// Define routes for rutwik
router.post('/create', createRutwik);
router.put('/update/:id', updateRutwik);
router.delete('/delete/:id', deleteRutwik);
router.get('/get/:id', getRutwik);
router.get('/getAll', getAllRutwik);

module.exports = router;
