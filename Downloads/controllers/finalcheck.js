// Generated controllers based on user input
const mongoose = require("mongoose"); 
const express = require("express"); 
const FinalCheck = require('../models/finalcheckSchema');

// CRUD operations for finalCheck
// Create Controller 
const createFinalCheck = async (req, res) => { 
    const { Newest, second } = req.body;
    try {
        const finalcheck = await FinalCheck.create({ Newest, second }) 
        await finalcheck.save();
        res.status(201).json(finalcheck);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            for (it in error.errors) {
                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        } console.error(error);
        res.status(500).json({'Server Error ': error.message});
    }
};

// Update Controller 
const updateFinalCheck = async (req, res) => { 
    const _id=req.params.id;
    const { Newest, second } = req.body;
    try {
        const finalcheck = await FinalCheck.findByIdAndUpdate( _id, { Newest, second },{new:true}) 
        if (!finalcheck) {
            return res.status(404).send('finalcheck not found');
        }
        await finalcheck.save();
        res.status(201).json(finalcheck);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            for (it in error.errors) {
                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        } console.error(error);
        return res.status(500).json({'Server Error':error.message});
    }
};

// Delete Controller 
const deleteFinalCheck = async (req, res) => { 
    const _id=req.params.id;
    try {
        const finalcheck = await FinalCheck.findById(_id)
        if (!finalcheck) {
            return res.status(404).send('finalcheck not found');
        }
        await FinalCheck.deleteOne({_id: _id})
        await finalcheck.save();
        res.status(201).json({message: "Deleted Successfully"});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            for (it in error.errors) {
                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        } console.error(error);
        return res.status(500).json({'Server Error':error.message});
    }
};

// get by Id Controller 
const getFinalCheck = async (req, res) => { 
    const _id=req.params.id;
    try {
        const finalcheck = await FinalCheck.findById(_id)
        if (!finalcheck) {
            return res.status(404).send('finalcheck not found');
        }
        res.status(201).json(finalcheck);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            for (it in error.errors) {
                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        } console.error(error);
        return res.status(500).json({'Server Error':error.message});
    }
};

// getAll Controller 
const getAllFinalCheck = async (req, res) => { 
    try {
        const finalcheck = await FinalCheck.find({})
        if (!finalcheck) {
            return res.status(404).send('Nothing found !!');
        }
        res.status(201).json(finalcheck);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            for (it in error.errors) {
                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        } console.error(error);
        return res.status(500).json({'Server Error':error.message});
    }
};

module.exports = {
    createFinalCheck,
    updateFinalCheck,
    deleteFinalCheck,
    getFinalCheck,
    getAllFinalCheck
}