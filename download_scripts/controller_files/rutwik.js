// Generated controllers based on user input
const mongoose = require("mongoose"); 
const express = require("express"); 
const Rutwik = require('./rutwik_schema');

// CRUD operations for rutwik
// Create Controller 
const createRutwik = async (req, res) => { 
    const { userfieldName, password, documents } = req.body;
    try {
        const rutwik = await Rutwik.create({ userfieldName, password, documents }) 
        await rutwik.save();
        res.status(201).json(rutwik);
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
const updateRutwik = async (req, res) => { 
    const { _id, userfieldName, password, documents } = req.body;
    try {
        const rutwik = await Rutwik.findByIdAndUpdate( _id, { userfieldName, password, documents },{new:true}) 
        if (!rutwik) {
            return res.status(404).send('rutwik not found');
        }
        await rutwik.save();
        res.status(201).json(rutwik);
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
const deleteRutwik = async (req, res) => { 
    const { _id } = req.body;
    try {
        const rutwik = await Rutwik.findById(_id)
        if (!rutwik) {
            return res.status(404).send('rutwik not found');
        }
        await Rutwik.deleteOne({_id: _id})
        await rutwik.save();
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
const getRutwik = async (req, res) => { 
    const { _id } = req.body;
    try {
        const rutwik = await Rutwik.findById(_id)
        if (!rutwik) {
            return res.status(404).send('rutwik not found');
        }
        res.status(201).json(rutwik);
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
const getAllRutwik = async (req, res) => { 
    try {
        const rutwik = await Rutwik.find({})
        if (!rutwik) {
            return res.status(404).send('Nothing found !!');
        }
        res.status(201).json(rutwik);
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
    createRutwik,
    updateRutwik,
    deleteRutwik,
    getRutwik,
    getAllRutwik
}