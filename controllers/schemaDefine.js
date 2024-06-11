const express = require("express");
const Project = require("../models/project")
const { ObjectId } = require('mongodb');
const SchemaDefine = require('../models/schema');

const createSchema = async (req, res) => {
    //validators
    const { name, projectId, fields } = req.body;
    if (!projectId || projectId == null || projectId == undefined) {
        return res.status(401).json({ message: "need Project ID" })
    }
    if (!name || name == null || name == undefined) {
        return res.status(401).json({ message: "need name" })
    }

    //finding project
    const project = await Project.findById(projectId);
    if (!project || project == null || project == undefined) {
        return res.status(401).json({ message: "project not found" })
    }

    // creating schema
    const newSchema = await SchemaDefine.create({
        name: name,
        fields: fields,
        projectId: projectId
    });
    const schemaId = newSchema._id;

    // updating project
    project.schemas.push(schemaId);
    await project.save();
    return res.status(200).json({ message: "OK" });
}

const deleteSchema = async (req, res) => {
    // validators
    const { projectId, schemaId } = req.body;
    if (!projectId || projectId == null || projectId == undefined) {
        return res.status(401).json({ message: "need Project ID" })
    }
    if (!schemaId || schemaId == null || schemaId == undefined) {
        return res.status(401).json({ message: "Need Schema ID" });
    }

    //finding project
    const project = await Project.findById(projectId);
    if (!project || project == null || project == undefined) {
        return res.status(401).json({ message: "project not found" })
    }

    // deleting schema
    await SchemaDefine.deleteOne({ _id: schemaId });

    // Updating project
    let tempSchemas = [];
    for (let i = 0; i < project.schemas.length; i++) {
        if(!project.schemas[i].equals(new ObjectId(schemaId))){
            tempSchemas.push(project.schemas[i]);
        }
    }
    project.schemas=tempSchemas;
    await project.save();
    return res.status(200).json({ message: "OK" })
}


const updateSchema = async (req, res) => {
    // validators
    const { schemaId, fields, name } = req.body;
    if (!schemaId || schemaId == null || schemaId == undefined) {
        return res.status(401).json({ message: "Need Schema ID" });
    }

    // finding schema
    const updatedSchema = await SchemaDefine.findById(schemaId);
    if(!updatedSchema || updatedSchema == null || updatedSchema == undefined) {
        return res.status(404).json({ message: "schema not found" })
    }

    // updating name and fields 
    if(!(fields===null) && !(fields===undefined) && (fields)){
        updatedSchema.fields=fields;
    }
    if((name) && !(name==null) && !(name==undefined) && (fields)){
        updatedSchema.name=name;
    }

    await updatedSchema.save();
    console.log(updatedSchema);
    res.status(200).json({ message: "OK" });
}

module.exports = {
    createSchema,
    updateSchema,
    deleteSchema
};

// const getAllSchemas = async (req, res) => {
//     const allSchemas = await SchemaDefine.find();
//     res.status(200).json({ message: "OK", schemas: allSchemas });
// }

// const getSchemaById = async (req, res) => {
//     const schema = await SchemaDefine.findById(req.params.id);
//     if (!schema) {
//         return res.status(404).json({ message: "Schema not found" });
//     }
//     res.status(200).json({ message: "OK" });
// }
