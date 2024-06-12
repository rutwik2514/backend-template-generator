// Generated routes based on user input
const express = require('express');
const router = express.Router();
const {createFinalCheck, updateFinalCheck, deleteFinalCheck, getFinalCheck, getAllFinalCheck } = require('../controllers/finalcheck');

// Define routes for finalCheck
router.post('/create', createFinalCheck);
router.put('/update/:id', updateFinalCheck);
router.delete('/delete/:id', deleteFinalCheck);
router.get('/get/:id', getFinalCheck);
router.get('/getAll', getAllFinalCheck);

module.exports = router;
