const IORedis = require('ioredis');
// const downloadQueue = require('./queue');
const axios = require("axios");
const { generateSchemaFiles, generateProfileSchema } = require('../download_scripts/schema_creation');
const generateControllers = require('../download_scripts/controller_creation');
const generateRoutes = require('../download_scripts/routes_creation');
const generatePermissions = require('../download_scripts/permission_creation');
const generateMiddlewares = require('../download_scripts/middleware_creation');
const generateEnv = require('../download_scripts/env_creation');
const generateConnect = require('../download_scripts/connect_creation');
const generateApp = require('../download_scripts/app_creation');
const generateGitIgnore = require('../download_scripts/gitignore_creation');
const generatePackageJson = require('../download_scripts/packageJson_creation');
const { MakeRepository, REPO_NAME } = require('../helper/github');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { Worker, Job, QueueEvents, Queue } = require('bullmq');
const path = require('path');
const fs = require('fs');



const makeControllers = async (schemas) => {
    schemas.map(async (schema) => {
        await generateControllers(schema);
    })
}

const connection = new IORedis({
    maxRetriesPerRequest: null
});
const worker = new Worker("jobQueue", async (job) => {
    const { user, token, projectId } = job.data;
    try {
        //axios post to get project info
        let project
        
        console.log("token in this is is", token)
        try {
            const res = await axios.get(`${process.env.PROJECT_SERVICE_URL}/getProjectInfo/${projectId}`, {
                headers: {
                    Authorization: token,
                }
            })
            project = res.data.project;
        } catch (error) {
            console.log("error in project service", error);
            return false;
            // return res.status(500).json({ message: "Something went wrong in communicating with schema_service", error });
        }
        let schemas = project.schemas;
        let roles = project.roles;
        // console.log("user is", user);
        try {
            const res = await axios.post(`${process.env.SCHEMA_SERVICE_URL}/getSchemas`, {
                schemas: schemas
            }, {
                headers: {
                    Authorization: token,
                }
            })
            schemas = res.data.schemas;
        } catch (error) {
            console.log("error in auth service", error);
            return false;
            // return res.status(500).json({ message: "Something went wrong in communicating with schema_service", error });
        }
        try {
            const res = await axios.post(`${process.env.ROLE_SERVICE_URL}/getRoles`, {
                roles: roles
            }, {
                headers: {
                    Authorization: token,
                }
            })
            roles = res.data.roles;
        } catch (error) {
            console.log("error in auth service", error);
            return false;
            // return res.status(500).json({ message: "Something went wrong in communicating with role_service", error });
        }
        await generateSchemaFiles(schemas)
        await makeControllers(schemas)
        await generateRoutes(schemas)
        await generatePermissions(project.permissions, roles, project.restrictedRoles)
        await generateProfileSchema();
        await generateMiddlewares();
        await generateEnv(project.name, user.userName);
        await generateConnect();
        await generateApp();
        await generateGitIgnore();
        await generatePackageJson(project.name);
        const response = await MakeRepository();
        const exactPath = path.join(process.cwd(), 'Downloads');
        try {
            const gitCommands = [
                'git init',
                `git add .`,
                'git commit -m "Initial commit"',
                'git branch -M main',
                `git remote add origin https://github.com/rutwik2514/${REPO_NAME}.git`,
                'git push -u origin main',
            ];

            for (const command of gitCommands) {
                const { stdout, stderr } = await execAsync(command, { cwd: exactPath });
                console.log('Command:', command);
                console.log('stdout:', stdout);
                console.error('stderr:', stderr);
            }

            // Delete the Downloads folder
            fs.rmSync(exactPath, { recursive: true, force: true });
            return response
            // return res.status(200).json(response)

        } catch (error) {
            console.error('Error executing script:', error);
            // return res.status(500).json({ message: "Error executing push-to-github.sh script", error });
            return false;
        }


    } catch (error) {
        console.log(error);
        // return res.status(200).json({ message: "Something went wrong" })
        return false;

    }

}, { connection });

module.exports = {worker}
