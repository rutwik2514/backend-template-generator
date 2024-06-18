// Generated controllers based on user input
const mongoose = require("mongoose"); 
const express = require("express"); 
const Nested = require('../models/nestedSchema');

// CRUD operations for Nested
// Create Controller 
const createNested = async (req, res) => { 
    const { userfieldName, password, documents } = req.body;
    try {
        const nested = await Nested.create({ userfieldName, password, documents }) 
        await nested.save();
        res.status(201).json(nested);
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
const updateNested = async (req, res) => { 
    const _id=req.params.id;
    const { userfieldName, password, documents } = req.body;
    try {
        const nested = await Nested.findByIdAndUpdate( _id, { userfieldName, password, documents },{new:true}) 
        if (!nested) {
            return res.status(404).send('nested not found');
        }
        await nested.save();
        res.status(201).json(nested);
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
const deleteNested = async (req, res) => { 
    const _id=req.params.id;
    try {
        const nested = await Nested.findById(_id)
        if (!nested) {
            return res.status(404).send('nested not found');
        }
        await Nested.deleteOne({_id: _id})
        await nested.save();
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
const getNested = async (req, res) => { 
    const _id=req.params.id;
    try {
        const nested = await Nested.findById(_id)
        if (!nested) {
            return res.status(404).send('nested not found');
        }
        res.status(201).json(nested);
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
const getAllNested = async (req, res) => { 
    try {
        const nested = await Nested.find({})
        if (!nested) {
            return res.status(404).send('Nothing found !!');
        }
        res.status(201).json(nested);
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
    createNested,
    updateNested,
    deleteNested,
    getNested,
    getAllNested
}