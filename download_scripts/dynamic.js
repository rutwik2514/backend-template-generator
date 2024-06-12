const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function setup() {
    if (!fs.existsSync('nodemon.json')) {
        const nodemonConfig = {
            ignore: ["login.js"]
        };

        fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig, null, 2));
        console.log('nodemon.json configuration saved!');
    } else {
        console.log('nodemon.json already exists, skipping creation.');
    }
}

async function generateControllers(schema) {
    await setup();

    //getting name
    const schemaName = schema.name;
    const keys = [];
    schema.keys.map((key) => {
        keys.push(key.keyName);
    })
    console.log("keys are", keys);

    // Get the parent directory of the current directory
    const parentDirectory = path.join(__dirname, '..');

    // Define the path for the Downloads directory in the parent directory
    const downloadsDirectory = path.join(parentDirectory, 'Downloads');

    // Create the Downloads directory if it doesn't exist
    if (!fs.existsSync(downloadsDirectory)) {
        fs.mkdirSync(downloadsDirectory, { recursive: true });
        console.log(`Directory created: ${downloadsDirectory}`);
    } else {
        console.log(`Directory already exists: ${downloadsDirectory}`);
    }

    // Define the path for the generated_files directory within the Downloads directory
    const controllerDirectory = path.join(downloadsDirectory, 'controllers');

    // Create the generated_files directory if it doesn't exist
    if (!fs.existsSync(controllerDirectory)) {
        fs.mkdirSync(controllerDirectory, { recursive: true });
        console.log(`Directory created: ${controllerDirectory}`);
    } else {
        console.log(`Directory already exists: ${controllerDirectory}`);
    }

    console.log(`Generated files will be stored in: ${controllerDirectory}`);


    makeControllers(controllerDirectory, schemaName, keys);
    return { parentDirectory };
}

function makeControllers(directory, schemaName, keys) {

    const controllerFileName = `${schemaName.toLowerCase()}.js`;
    const controllerFilePath = path.join(directory, controllerFileName);
    const modelName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1);

    //making create controller

    let controllersCode = '// Generated controllers based on user input\n';
    controllersCode += `const mongoose = require("mongoose"); \n`;
    controllersCode += `const express = require("express"); \n`;
    controllersCode += `const ${modelName} = require('../models/${schemaName.toLowerCase()}Schema');\n\n`;
    controllersCode += `// CRUD operations for ${schemaName}\n`;
    controllersCode += `// Create Controller \n`;
    controllersCode += `const create${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
    controllersCode += `    const { `;
    keys.map((key, idx) => {
        if (idx !== keys.length - 1) {
            controllersCode += `${key}` + `, `;
            console.log(typeof key);
        } else {
            controllersCode += `${key}`;
            console.log(typeof key);
        }
    });
    controllersCode += ` } = req.body;\n`;
    controllersCode += `    try {\n`;
    controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.create({ `;
    keys.map((key, idx) => {
        controllersCode += `${key}`;
        if (idx !== keys.length - 1) {
            controllersCode += `, `;
        }
    })
    controllersCode += ` }) \n`;
    controllersCode += `        await ${schemaName.toLowerCase()}.save();\n`;
    controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
    controllersCode += `    } catch (error) {\n`;
    controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
    controllersCode += `            for (it in error.errors) {\n`;
    controllersCode += `                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        }`
    controllersCode += ` console.error(error);\n`;
    controllersCode += `        res.status(500).json({'Server Error ': error.message});\n`;
    controllersCode += `    }\n`;
    controllersCode += `};\n\n`;



    //making update controller
    controllersCode += `// Update Controller \n`;
    controllersCode += `const update${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
    controllersCode += `    const { `;
    controllersCode += `_id, `
    keys.map((key, idx) => {
        if (idx !== keys.length - 1) {
            controllersCode += `${key}` + `, `;
            console.log(typeof key);
        } else {
            controllersCode += `${key}`;
            console.log(typeof key);
        }
    });
    controllersCode += ` } = req.body;\n`;
    controllersCode += `    try {\n`;
    controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.findByIdAndUpdate( _id, { `;
    keys.map((key, idx) => {
        controllersCode += `${key}`;
        if (idx !== keys.length - 1) {
            controllersCode += `, `;
        }
    })
    controllersCode += ` },{new:true}) \n`;
    controllersCode += `        if (!${schemaName.toLowerCase()}) {
            return res.status(404).send('${schemaName.toLowerCase()} not found');
        }\n`
    controllersCode += `        await ${schemaName.toLowerCase()}.save();\n`;
    controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
    controllersCode += `    } catch (error) {\n`;
    controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
    controllersCode += `            for (it in error.errors) {\n`;
    controllersCode += `                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        }`
    controllersCode += ` console.error(error);\n`;
    controllersCode += `        return res.status(500).json({'Server Error':error.message});\n`;
    controllersCode += `    }\n`;
    controllersCode += `};\n\n`;


    // making delete controller
    controllersCode += `// Delete Controller \n`;
    controllersCode += `const delete${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
    controllersCode += `    const { `;
    controllersCode += `_id`
    controllersCode += ` } = req.body;\n`;
    controllersCode += `    try {\n`;
    controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.findById(_id)`;
    controllersCode += `\n`;
    controllersCode += `        if (!${schemaName.toLowerCase()}) {
            return res.status(404).send('${schemaName.toLowerCase()} not found');
        }\n`
    controllersCode += `        await ${modelName}.deleteOne({_id: _id})\n`
    controllersCode += `        await ${schemaName.toLowerCase()}.save();\n`;
    controllersCode += `        res.status(201).json({message: "Deleted Successfully"});\n`;
    controllersCode += `    } catch (error) {\n`;
    controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
    controllersCode += `            for (it in error.errors) {\n`;
    controllersCode += `                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        }`
    controllersCode += ` console.error(error);\n`;
    controllersCode += `        return res.status(500).json({'Server Error':error.message});\n`;
    controllersCode += `    }\n`;
    controllersCode += `};\n\n`;


    // making get by Id controller
    controllersCode += `// get by Id Controller \n`;
    controllersCode += `const get${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
    controllersCode += `    const { `;
    controllersCode += `_id`
    controllersCode += ` } = req.body;\n`;
    controllersCode += `    try {\n`;
    controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.findById(_id)`;
    controllersCode += `\n`;
    controllersCode += `        if (!${schemaName.toLowerCase()}) {
            return res.status(404).send('${schemaName.toLowerCase()} not found');
        }\n`
    controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
    controllersCode += `    } catch (error) {\n`;
    controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
    controllersCode += `            for (it in error.errors) {\n`;
    controllersCode += `                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        }`
    controllersCode += ` console.error(error);\n`;
    controllersCode += `        return res.status(500).json({'Server Error':error.message});\n`;
    controllersCode += `    }\n`;
    controllersCode += `};\n\n`;


    // making getAll controller
    controllersCode += `// getAll Controller \n`;
    controllersCode += `const getAll${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
    controllersCode += `    try {\n`;
    controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.find({})`;
    controllersCode += `\n`;
    controllersCode += `        if (!${schemaName.toLowerCase()}) {
            return res.status(404).send('Nothing found !!');
        }\n`
    controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
    controllersCode += `    } catch (error) {\n`;
    controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
    controllersCode += `            for (it in error.errors) {\n`;
    controllersCode += `                console.log(error.errors[it].message);
            }
            return res.status(400).send(error.message);
        }`
    controllersCode += ` console.error(error);\n`;
    controllersCode += `        return res.status(500).json({'Server Error':error.message});\n`;
    controllersCode += `    }\n`;
    controllersCode += `};\n\n`;


    controllersCode += `module.exports = {\n`
    controllersCode += `    create${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)},\n`
    controllersCode += `    update${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)},\n`
    controllersCode += `    delete${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)},\n`
    controllersCode += `    get${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)},\n`
    controllersCode += `    getAll${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)}\n`
    controllersCode += `}`

    fs.writeFileSync(controllerFilePath, controllersCode);
}

module.exports = generateControllers


