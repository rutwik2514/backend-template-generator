const fs = require('fs');
const path = require('path');

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

async function generateRoutes(schemas) {

    await setup();

    console.log('schema from routes is', schemas);

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
    const routesDirectory = path.join(downloadsDirectory, 'routes');

    // Create the generated_files directory if it doesn't exist
    if (!fs.existsSync(routesDirectory)) {
        fs.mkdirSync(routesDirectory, { recursive: true });
        console.log(`Directory created: ${routesDirectory}`);
    } else {
        console.log(`Directory already exists: ${routesDirectory}`);
    }

    console.log(`Generated files will be stored in: ${routesDirectory}`);

    schemas.forEach((schema)=>{
        makeRoutes(routesDirectory,schema.name)
    })

}

function makeRoutes(directory, schemaName) {
    const routesFileName = `${schemaName.toLowerCase()}.js`;
    const routesFilePath = path.join(directory, routesFileName);
    const controllerName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1);

    let routesCode = '// Generated routes based on user input\n';
    routesCode += `const express = require('express');\n`;
    routesCode += `const router = express.Router();\n`;
    routesCode += `const {`;
    routesCode += `create${controllerName}, `;
    routesCode += `update${controllerName}, `;
    routesCode += `delete${controllerName}, `;
    routesCode += `get${controllerName}, `;
    routesCode += `getAll${controllerName} `;
    routesCode += `} = require('../controllers/${schemaName.toLowerCase()}');\n\n`;

    routesCode += `// Define routes for ${schemaName}\n`;
    routesCode += `router.post('/create', create${controllerName});\n`;
    routesCode += `router.put('/update/:id', update${controllerName});\n`;
    routesCode += `router.delete('/delete/:id', delete${controllerName});\n`;
    routesCode += `router.get('/get/:id', get${controllerName});\n`;
    routesCode += `router.get('/getAll', getAll${controllerName});\n\n`;

    routesCode += `module.exports = router;\n`;

    fs.writeFileSync(routesFilePath, routesCode);
}

module.exports = generateRoutes;
