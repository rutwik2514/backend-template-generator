const fs = require('fs');
const path = require('path');

function setup() {
  if (!fs.existsSync('nodemon.json')) {
    const nodemonConfig = {
      ignore: ["permissions.js", "preet.js", "newcheckSchema.js", "userSchema.js", "preetSchema.js"]
    };

    fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig, null, 2));
    console.log('nodemon.json configuration saved!');
  } else {
    console.log('nodemon.json already exists, skipping creation.');
  }
}
async function generateFiles() {
  await setup();
  const schemas = [
    {
      "_id": {
        "$oid": "666844e75ab2f868a2b7e1bf"
      },
      "name": "login",
      "fields": [
        {
          "fieldName": "userfieldName",
          "dataType": "String",
          "isUnique": true,
          "isRequired": true,
          "content": [
            ""
          ],
          "_id": {
            "$oid": "666844e75ab2f868a2b7e1c0"
          }
        },
        {
          "fieldName": "password",
          "dataType": "String",
          "isUnique": true,
          "isRequired": true,
          "content": [
            ""
          ],
          "_id": {
            "$oid": "666844e75ab2f868a2b7e1c1"
          }
        },
        {
          "fieldName": "documents",
          "dataType": "Array",
          "isUnique": false,
          "isRequired": true,
          "content": [
            {
              "fieldName": "documentfieldName",
              "isRequired": false,
              "isUnique": false,
              "dataType": "String"
            },
            {
              "fieldName": "random",
              "isRequired": false,
              "isUnique": false,
              "dataType": "Number"
            }
          ],
          "_id": {
            "$oid": "666844e75ab2f868a2b7e1c2"
          }
        }
      ],
      "projectId": {
        "$oid": "665ea17077d0f3b15ab973e9"
      },
      "__v": 0
    }

  ];
  const directory = path.join(__dirname, 'generated_files');

  schemas.forEach(schema => {
    makeSchema(schema, directory);
  });


  return { directory };
}

function makeSchema(schema, directory) {
  if (schema.name == "preet") {
    console.log("schema", schema);
  }
  const schemaFileName = `${schema.name.toLowerCase()}Schema.js`;
  const schemaFilePath = path.join(directory, schemaFileName);
  let schemaCode = `const mongoose = require('mongoose');\n\n`;
  schemaCode += `const ${schema.name}Schema = new mongoose.Schema(\n{\n`;
  schemaCode += schemaString(schema)
  schemaCode += `});\n\n`;
  schemaCode += `module.exports = mongoose.model('${schema.name}', ${schema.name}Schema);\n`;


  fs.writeFileSync(schemaFilePath, schemaCode);
}
function schemaString(schema) {
  let schemaCode = "";
  schema?.fields?.forEach(field => {
    if (field.dataType !== "Array") {
      console.log("adding to string", field);
      schemaCode += `    ${field.fieldName}: { \n`;
      schemaCode += `        dataType: ${field.dataType},\n`;
      schemaCode += `        required: ${field.isRequired},\n`;
      schemaCode += `        unique: ${field.isUnique}\n`;
      schemaCode += `    },\n`;
    }
    else {
      schemaCode += `${field.fieldName} : [\n{ \n`
      schemaCode += addContent(field.content);
      schemaCode += `}\n],\n`
    }
  });
  return schemaCode;
}
function addContent(content) {
  console.log("came in content", content);
  let schemaCode = "";
  content.forEach(field => {
    if (field.dataType !== "Array") {
      console.log("adding to string", field);
      schemaCode += `  \n   ${field.fieldName}: { \n`;
      schemaCode += `        dataType: ${field.dataType},\n`;
      schemaCode += `        required: ${field.isRequired},\n`;
      schemaCode += `        unique: ${field.isUnique}\n`;
      schemaCode += `    \n},\n`;
    }
    else {
      schemaCode += `{ ${field.fieldName} : [\n{ \n`
      schemaCode += addContent(field.content);
      schemaCode += `}\n]\n},\n`
    }
  })
  return schemaCode;
}

module.exports = generateFiles;