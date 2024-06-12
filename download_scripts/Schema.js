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
async function generateSchemaFiles(schemas) {
  await setup();
  const directory = path.join(__dirname, 'generated_files');
  console.log("schemas are", schemas);
  schemas.forEach(schema => {
    makeSchema(schema, directory);
  });


  return { directory };
}

function makeSchema(schema, directory) {
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
  let keys = [];
  schema?.fields?.forEach(field => {
    keys.push(field.fieldName);
    if (field.dataType !== "Array") {
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
  let schemaCode = "";
  content.forEach(field => {
    if (field.dataType !== "Array") {
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

module.exports = generateSchemaFiles