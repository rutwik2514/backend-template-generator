const Project = require('../models/project');
const axios = require("axios");
const {
    generateSchemaFiles,
    generateProfileSchema
} = require('../download_scripts/schema_creation');
const generateControllers = require('../download_scripts/controller_creation');
const generateRoutes = require('../download_scripts/routes_creation');
const generatePermissions = require('../download_scripts/permission_creation');
const generateMiddlewares = require('../download_scripts/middleware_creation');
const generateEnv = require('../download_scripts/env_creation');
const generateConnect = require('../download_scripts/connect_creation');
const generateApp = require('../download_scripts/app_creation');
const generateGitIgnore = require('../download_scripts/gitignore_creation');
const generatePackageJson = require('../download_scripts/packageJson_creation');
const { MakeRepository } = require('../helper/github');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const Queue = require("bull");
const dotenv = require("dotenv");
dotenv.config();
const rimraf = require('rimraf');
const fs = require("fs");

const makeControllers = async (schemas) => {
    schemas.map(async (schema) => {
        await generateControllers(schema);
    });
};

const { REDIS_HOST, REDIS_PORT } = process.env;

const redisOptions = {
    redis: { host: REDIS_HOST, port: REDIS_PORT }
};
const jobQueue = new Queue("jobQueue", redisOptions);
const errorQueue = new Queue("errorQueue", redisOptions);

const processJob = async (job, done) => {
    const { user, token, projectId } = job.data;
    try {
        const project = await Project.findById(projectId);

        console.log("Token:", token);

        let schemas = project.schemas;
        let roles = project.roles;
        try {
            const res = await axios.post(`${process.env.SCHEMA_SERVICE_URL}/getSchemas`, {
                schemas
            }, {
                headers: { Authorization: token }
            });
            schemas = res.data.schemas;
        } catch (error) {
            console.log("Error in schema service", error);
            return done(new Error("Error communicating with schema service"));
        }

        try {
            const res = await axios.post(`${process.env.ROLE_SERVICE_URL}/getRoles`, {
                roles
            }, {
                headers: { Authorization: token }
            });
            roles = res.data.roles;
        } catch (error) {
            console.log("Error in role service", error);
            return done(new Error("Error communicating with role service"));
        }

        await generateSchemaFiles(schemas);
        await makeControllers(schemas);
        await generateRoutes(schemas);
        await generatePermissions(project.permissions, roles, project.restrictedRoles);
        await generateProfileSchema();
        await generateMiddlewares();
        await generateEnv(project.name, user.userName);
        await generateConnect();
        await generateApp();
        await generateGitIgnore();
        await generatePackageJson(project.name);

        let repoName = "";
        let githubUrl = "";
        let alreadyCreated = false;
        if(project.githubUrl== "" && project.repoName == ""){
        const { createdRepoName, createdGithubUrl } = await MakeRepository();
            repoName=createdRepoName
            githubUrl = createdGithubUrl;
        }
        else{
            alreadyCreated=true;
            repoName=project.repoName;
            githubUrl=project.githubUrl;
        }
        const exactPath = path.join(process.cwd(), 'Downloads');
        console.log("Exact path:", exactPath);
        const url = `https://BackendBuddy07:${process.env.GITHUB_TOKEN}@github.com/BackendBuddy07/${repoName}.git`;
        console.log("URL:", url);

        try {
            const gitCommands = [
                'git init',
                'git add .',
                `git commit -m ${alreadyCreated?'"Changes updated"':'"Initial commit"'}`,
                'git branch -M main',
                `git remote add origin ${url}`,
                'git push -u origin main --force',
            ];

            for (const command of gitCommands) {
                const { stdout, stderr } = await execAsync(command, { cwd: exactPath });
                console.log('Command:', command);
                console.log('stdout:', stdout);
                console.error('stderr:', stderr);
            }
            
            if(!alreadyCreated){
                try {
                    project.githubUrl= githubUrl;
                    project.repoName=repoName;
                    await project.save();
                } catch (error) {
                    if (fs.existsSync(exactPath)) {
                        console.log(`Directory ${exactPath} exists. Deleting...`);
                        rimraf.sync(exactPath);
                        console.log(`Directory ${exactPath} deleted.`);
                    } else {
                        console.log(`Directory ${exactPath} does not exist.`);
                    }
                    return done(new Error("Error executing git commands"));
                }
            }

            rimraf.sync(exactPath);
            done(null, { githubUrl });

        } catch (error) {
            console.error('Error executing git commands:', error);
            if (fs.existsSync(exactPath)) {
                console.log(`Directory ${exactPath} exists. Deleting...`);
                rimraf.sync(exactPath);
                console.log(`Directory ${exactPath} deleted.`);
            } else {
                console.log(`Directory ${exactPath} does not exist.`);
            }
            return done(new Error("Error executing git commands"));
        }
    } catch (error) {
        console.log(error);
        return done(new Error("An error occurred while processing the job"));
    }
};

jobQueue.process(processJob);
errorQueue.process(processJob);
