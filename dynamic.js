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

async function generateControllers() {
    await setup();
    const schemas = [
        {
            userfieldName: {
                dataType: String,
                required: true,
                unique: true
            },
            password: {
                dataType: String,
                required: true,
                unique: true
            },
            documents: [
                {

                    documentfieldName: {
                        dataType: String,
                        required: false,
                        unique: false

                    },

                    random: {
                        dataType: Number,
                        required: false,
                        unique: false

                    },
                }
            ],
        }
    ];


    let check = `const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema(
    {
        userfieldName: {
            dataType: String,
            required: true,
            unique: true
        },
        password: {
            dataType: String,
            required: true,
            unique: true
        },
        documents: [
            {

                documentfieldName: {
                    dataType: String,
                    required: false,
                    unique: false

                },

                random: {
                    dataType: Number,
                    required: false,
                    unique: false

                },
            }
        ],
    });

module.exports = mongoose.model('login', loginSchema);
`
    const schemaNameMatch = check.match(/module\.exports\s*=\s*mongoose\.model\(\s*['"](\w+)['"]/);

    // Check if a match was found and extract the schema name
    const schemaName = schemaNameMatch[1];

    // const objectStringMatch = check.match(/new mongoose\.Schema\s*\(\s*([\s\S]*?)\s*\)\s*;/);
    // const objectString = objectStringMatch[1].trim();
    // const jsonString = objectString
    //     .replace(/dataType/g, 'type')
    //     .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
    //     .replace(/'/g, '"');
    // const schemaObject = JSON.parse(jsonString);
    // console.log('start',Object.keys(jsonString), 'end');
    // Extract keys from the schema object
    const keys = [];
    const schemaMatches = check.match(/new mongoose\.Schema\s*\(\s*({[\s\S]?})\s\)\s*;/);
    if (schemaMatches && schemaMatches.length > 1) {
        const schemaString = schemaMatches[1];
        const schemaObject = eval(`(${schemaString})`);
        for (const key in schemaObject) {
            if (schemaObject.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
    }

    console.log('Keys:', keys);

    // const directory = path.join(__dirname, 'controller_files');

    // makeControllers(objectString, directory, schemaName);
    // return { directory };
}

// function makeControllers(schema, directory, schemaName) {

//     const keys = Object.keys(schema);
//     const newKeys = keys.filter((key) => key != '_id' && key !== '__v');

//     console.log("NewKeys are", newKeys);

//     const controllerFileName = `${schemaName.toLowerCase()}.js`;
//     const controllerFilePath = path.join(directory, controllerFileName);
//     const modelName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1);

//     let controllersCode = '// Generated controllers based on user input\n\n';
//     controllersCode += `const mongoose = require("mongoose"); \n`;
//     controllersCode += `const express = require("express"); \n`;
//     controllersCode += `const ${modelName} = require('./${schemaName.toLowerCase()}_schema');\n\n`;
//     controllersCode += `// CRUD operations for ${schemaName}\n`;
//     controllersCode += `// Create Controller \n`;
//     controllersCode += `const create${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
//     controllersCode += `    const { `;
//     newKeys.map((key, idx) => {
//         if (idx !== newKeys.length - 1) {
//             controllersCode += `${key}` + `, `;
//             console.log(typeof key);
//         } else {
//             controllersCode += `${key}`;
//             console.log(typeof key);
//         }
//     });
//     controllersCode += ` } = req.body;\n`;
//     controllersCode += `    try {\n`;
//     controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.create({ `;
//     newKeys.map((key, idx) => {
//         controllersCode += `${key}`;
//         if (idx !== newKeys.length - 1) {
//             controllersCode += `, `;
//         }
//     })
//     controllersCode += ` }) \n`;
//     controllersCode += `        await ${schemaName.toLowerCase()}.save();\n`;
//     controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
//     controllersCode += `    } catch (error) {\n`;
//     controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
//     controllersCode += `            for (it in error.errors) {\n`;
//     controllersCode += `                console.log(error.errors[it].message);
//             }
//             return res.status(400).send(error.message);
//         }`
//     controllersCode += ` console.error(err);\n`;
//     controllersCode += `        res.status(500).send('Server Error');\n`;
//     controllersCode += `    }\n`;
//     controllersCode += `};\n\n`;


//     controllersCode += `// Update Controller \n`;
//     controllersCode += `const update${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = async (req, res) => { \n`;
//     controllersCode += `    const { `;
//     controllersCode += `_id, `
//     newKeys.map((key, idx) => {
//         if (idx !== newKeys.length - 1) {
//             controllersCode += `${key}` + `, `;
//             console.log(typeof key);
//         } else {
//             controllersCode += `${key}`;
//             console.log(typeof key);
//         }
//     });
//     controllersCode += ` } = req.body;\n`;
//     controllersCode += `    try {\n`;
//     controllersCode += `        const ${schemaName.toLowerCase()} = await ${modelName}.findByIdAndUpdate({ `;
//     controllersCode += `_id, `;
//     newKeys.map((key, idx) => {
//         controllersCode += `${key}`;
//         if (idx !== newKeys.length - 1) {
//             controllersCode += `, `;
//         }
//     })
//     controllersCode += ` }) \n`;
//     controllersCode += `        await ${schemaName.toLowerCase()}.save();\n`;
//     controllersCode += `        res.status(201).json(${schemaName.toLowerCase()});\n`;
//     controllersCode += `    } catch (error) {\n`;
//     controllersCode += `        if (error instanceof mongoose.Error.ValidationError) {\n`;
//     controllersCode += `            for (it in error.errors) {\n`;
//     controllersCode += `                console.log(error.errors[it].message);
//             }
//             return res.status(400).send(error.message);
//         }`
//     controllersCode += ` console.error(err);\n`;
//     controllersCode += `        res.status(500).send('Server Error');\n`;
//     controllersCode += `    }\n`;
//     controllersCode += `};\n\n`;


//     fs.writeFileSync(controllerFilePath, controllersCode);
// }

module.exports = generateControllers


