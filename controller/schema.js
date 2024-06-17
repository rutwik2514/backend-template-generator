const express = require("express");
const { ObjectId } = require('mongodb');
const SchemaDefine = require('../model/schema');
const axios = require("axios");

const createSchema = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, fields } = req.body;
        const token = req.headers['authorization'];

        if (!projectId || projectId == null || projectId == undefined) {
            return res.status(401).json({ message: "need Project ID" })
        }
        if (!name || name == null || name == undefined) {
            return res.status(401).json({ message: "need name" })
        }

        // creating schema
        let keys = [];
        fields.map((field, index) => {
            keys.push({ keyName: `${field.fieldName}` });
        })
        console.log("token is", token);
        const newSchema = await SchemaDefine.create({
            name: name,
            fields: fields,
            projectId: projectId,
            keys: keys,
        });
        const schemaId = newSchema._id;
        try {
            const res = await axios.post(`${process.env.PROJECT_SERVICE_URL}/addSchema/${projectId}`, {
                name: name,
                schemaId: schemaId,
            }, {
                headers: {
                    Authorization: token,
                }
            })
            console.log("res is", res.body);
        } catch (error) {
            console.log("error in contacting to project service in create scehma controller", error);
            return res.status(500).json({ message: "Something Went Wrong" });
        }
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log("Error occured in create schema controller", error.message);
        return res.status(500).json({ message: "Something Went Wrong" });


    }

}

const deleteSchema = async (req, res) => {
    // validators
    const { projectId, schemaId } = req.params;
    const token = req.headers['authorization'];
    if (!projectId || projectId == null || projectId == undefined) {
        return res.status(401).json({ message: "need Project ID" })
    }
    if (!schemaId || schemaId == null || schemaId == undefined) {
        return res.status(401).json({ message: "Need Schema ID" });
    }
    const schema = await SchemaDefine.findById(schemaId);

    try {
        const res = await axios.delete(`${process.env.PROJECT_SERVICE_URL}/deleteSchema/${projectId}`,
            {
                headers: {
                    Authorization: token,
                },
                data: {
                    name: schema.name,
                    schemaId: schemaId
                }
            })

    } catch (error) {
        console.log("token is", token);
        console.log("error is", error);
    }

    // deleting schema
    await SchemaDefine.deleteOne({ _id: schemaId });
    return res.status(200).json({ message: "OK" })
}




const updateSchema = async (req, res) => {
    try {
        // validators
        const { schemaId } = req.params

        const { fields } = req.body;
        //note that name cant be modified
        if (!schemaId || schemaId == null || schemaId == undefined) {
            return res.status(401).json({ message: "Need Schema ID" });
        }

        // finding schema
        const updatedSchema = await SchemaDefine.findById(schemaId);
        if (!updatedSchema || updatedSchema == null || updatedSchema == undefined) {
            return res.status(404).json({ message: "schema not found" })
        }


        // updating name and fields 
        if (!(fields === null) && !(fields === undefined) && (fields)) {
            updatedSchema.fields = fields;
        }
        await updatedSchema.save();
        console.log(updatedSchema);
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log("Error occured in update schema controller", error.message);
        return res.status(500).json({ message: "Something Went Wrong" });
    }

}

const getSchemas = async (req, res) => {
    try {
        let {schemas} = req.body;
        console.log("schemas are", schemas);
        let allSchemas = [];
        await Promise.all(
            schemas.map(async (schemaId) => {
                const schema = await SchemaDefine.findById(schemaId);
                if (schema != undefined && schema != null && schema) {
                    allSchemas.push(schema);
                }
            })
        )
        return res.status(200).json({ message: "Ok", schemas: allSchemas });
    } catch (error) {
        console.log("error in getSchemas controller", error);
        return res.status(500).json({ message: "Something went wrong" });

    }

}

module.exports = {
    createSchema,
    updateSchema,
    deleteSchema,
    getSchemas
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
