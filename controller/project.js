const express = require("express");
const Project = require("../models/project")
const { ObjectId } = require('mongodb');
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { generateSchemaFiles } = require("../download_scripts/schema_creation");
const generateControllers = require("../download_scripts/controller_creation");
const generateRoutes = require("../download_scripts/routes_creation");
const generatePermissions = require("../download_scripts/permission_creation");
const { generateProfileSchema } = require("../download_scripts/schema_creation");
const generateMiddlewares = require("../download_scripts/middleware_creation");
const generateEnv = require("../download_scripts/env_creation");
const generateConnect = require("../download_scripts/connect_creation");
const generateApp = require("../download_scripts/app_creation");
const generateGitIgnore = require("../download_scripts/gitignore_creation");
const generatePackageJson = require("../download_scripts/packageJson_creation");
const { MakeRepository } = require("../helper/github");
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
// const shFile = require("./")
const newProject = async (req, res) => {
    try {
        const name = req.body.name;
        const token = req.headers['authorization'];

        if (name == undefined || name == null || !name) {
            return res.status(401).json({ message: "Should provide Name" });
        }


        const userId = req.access_token.id;
        //adding project to datase
        const newProject = await Project.create({ userId: userId, name: name, roles: [], permissions: [], restrictedRoles: [], schemas: [] });

        //contacting auth_service to add project in user profile
        try {
            await axios.post(`${process.env.AUTH_SERVICE_URL}/addProject`, {
                userId: userId,
                projectId: newProject._id
            }, {
                headers: {
                    Authorization: token,
                }
            })
        } catch (error) {
            console.log("error in auth service", error);
            return res.status(500).json({ message: "Something went wrong in communicating with auth_service", error });
        }

        return res.status(200).json({ message: "OK", id: newProject._id });

    } catch (error) {
        console.log("Something went wrong in newProject Controller", error);
        return res.status(500).json({ message: "Something Went Wrong" });


    }

}

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // send request to user_Service for deleting this id from projects
        const userId = req.access_token.id;
        const token = req.headers['authorization'];
        try {
            const res = await axios.delete(`${process.env.AUTH_SERVICE_URL}/deleteProject`,
                {
                    headers: {
                        Authorization: token,
                    },
                    data: {
                        userId: userId,
                        projectId: projectId
                    }
                })

        } catch (error) {
            console.log("error in auth service", error);
            return res.status(500).json({ message: "Something went wrong in communicating with auth_service", error });
        }
        await Project.deleteOne({ _id: projectId });
        return res.status(200).json({ message: "OK" });

    } catch (error) {
        console.log("Something went wrong in deleteProject Controller", error);
        return res.status(500).json({ message: "Something went wrong" });

    }

}

const getAllProjects = async (req, res) => {
    try {
        const userId = req.access_token.id;
        const query = { userId: userId };
        const projects = await Project.find(query);
        if (projects) {
            return res.status(200).json({ message: "Ok", projects: projects });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });

        }
    } catch (error) {
        console.log("error in getAllProjects controller", error);
        return res.status(500).json({ message: "Something went wrong" });

    }

}

const getProjectInfo = async (req, res) => {
    try {
        // const {projectId} = req.body;
        const projectId = req.params.projectId;
        console.log("came in project info");
        if (projectId == null || projectId == undefined || !projectId) {
            return res.status(500).json({ message: "Need project Id" });

        }
        console.log("projectId is", projectId);
        const project = await Project.findById(projectId);
        //removed .populate(roles) // populate using roles
        if (project) {
            return res.status(200).json({ message: "Ok", project: project });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });

        }
    } catch (error) {
        console.log("error occured in getProjectInfo controller", error);
        return res.status(500).json({ message: "Something went wrong" });

    }

}

const addPermission = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { permissions } = req.body;
        if (projectId == null || projectId == undefined || !projectId) {
            return res.status(401).json({ message: "need project id" })
        }
        //finding project
        const project = await Project.findById(projectId);
        if (!project || project == null || project == undefined) {
            return res.status(401).json({ message: "Project not found" })
        }
        //adding permission
        project.permissions = permissions;
        await project.save();
        return res.status(200).json({ message: "OK" })

    } catch (error) {
        console.log("Error occured in addPermission controller", error);
        return res.status(500).json({ message: "Something Went wrong" })

    }
    //validators

}
const deletePermission = async (req, res) => {
    try {
        //validators
        const { projectId } = req.params;
        const { permission } = req.body;
        if (projectId == null || projectId == undefined || !projectId) {
            return res.status(401).json({ message: "need project id" })
        }

        // finding project
        const project = await Project.findById(projectId);
        if (!project || project == null || project == undefined) {
            return res.status(401).json({ message: "Project not found" })
        }

        //deleting permissions
        let tempPermissions = [];
        for (let i = 0; i < project.permissions.length; i++) {
            if (project.permissions[i] !== permission) {
                tempPermissions.push(project.permissions[i]);
            }
        }
        project.permissions = tempPermissions;
        await project.save();
        return res.status(200).json({ message: "OK" })
    } catch (error) {
        console.log("error occured in deletePermission controller", error);
        return res.status(500).json({ message: "Something went wrong" })

    }

}
const getAllPermisisons = async (req, res) => {

    try {
        const { projectId } = req.params;
        console.log("project id is", projectId);
        if (projectId == null || projectId == undefined || !projectId) {
            return res.status(401).json({ message: "need project id" })
        }
        //finding project
        const project = await Project.findById(projectId);
        if (!project || project == null || project == undefined) {
            return res.status(401).json({ message: "Project not found" })
        }

        return res.status(200).json({ message: "OK", permissions: project.permissions })
    } catch (error) {
        console.log("error occured in getAllPermisisons controller", error);

        return res.status(500).json({ message: "Something went wrong" })

    }

}

const addRole = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { role, isRestricted, name } = req.body;
        if (!role || role == undefined || role == null) {
            return res.status(500).json({ message: "Need role" })
        }
        const project = await Project.findById(projectId);
        if (!project || project == undefined || project == null) {
            return res.status(500).json({ message: "Project not found" })
        }
        if (isRestricted) {
            project.restrictedRoles.push(name);
        }
        project.roles.push(role);
        await project.save();
        return res.status(200).json({ mesage: "Role added Succesffuly" })

    } catch (error) {
        console.log("Error occured in add role controller", error);
        return res.status(500).json({ message: "Something went wrong" })

    }
}

const deleteRole = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { role, name } = req.body;
        console.log('body is', req.body);
        if (!role || role == undefined || role == null) {
            return res.status(500).json({ message: "Need role" })
        }
        const project = await Project.findById(projectId);
        if (!project || project == undefined || project == null) {
            return res.status(500).json({ message: "Project not found" })
        }

        let tempRestrictedRoles = [];
        await Promise.all(
            project?.restrictedRoles?.map(async (role) => {
                if (role !== name) {
                    tempRestrictedRoles.push(role);
                }
            })
        );
        project.restrictedRoles = tempRestrictedRoles;

        let tempRoles = [];
        await Promise.all(
            project?.restrictedRoles?.map(async (role) => {
                if (!role.equals(new ObjectId(role))) {
                    tempRoles.push(role);
                }
            })
        );
        // console.log("temproles are");
        project.roles = tempRoles;
        await project.save();
        return res.status(200).json({ message: "Role Deleted Successfully" });

    } catch (error) {
        console.log("Error occured in add role controller");
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const addSchema = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { schemaId, name } = req.body;
        if (!projectId || projectId == null || projectId == undefined) {
            return res.status(401).json({ message: "need Project ID" })
        }

        const project = await Project.findById(projectId);
        if (!project || project == null || project == undefined) {
            return res.status(401).json({ message: "project not found" })
        }
        if (!project.permissions.includes(`create${name}`)) {
            project.permissions.push(`create${name}`);
        }
        if (!project.permissions.includes(`update${name}`)) {
            project.permissions.push(`update${name}`);
        }
        if (!project.permissions.includes(`delete${name}`)) {
            project.permissions.push(`delete${name}`);
        }
        if (!project.permissions.includes(`read${name}`)) {
            project.permissions.push(`read${name}`);
        }
        project.schemas.push(schemaId);
        await project.save();
        return res.status(200).json({ message: "Ok" });


    } catch (error) {
        console.log("Error occured in add schema controller", error.message);
        return res.status(500).json({ message: "Something went wrong" });
    }


}


const deleteSchema = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { schemaId, name } = req.body;
        if (!projectId || projectId == null || projectId == undefined) {
            return res.status(401).json({ message: "need Project ID" })
        }

        const project = await Project.findById(projectId);
        let schemaPermissions = [`create${name}`, `update${name}`, `delete${name}`, `read${name}`];
        let currentPermissions = project.permissions;
        currentPermissions = currentPermissions.filter(permission => !schemaPermissions.includes(permission));
        let tempSchemas = [];
        for (let i = 0; i < project.schemas.length; i++) {
            if (!project.schemas[i].equals(new ObjectId(schemaId))) {
                tempSchemas.push(project.schemas[i]);
            }
        }
        project.schemas = tempSchemas;
        project.permissions = currentPermissions
        await project.save();
        return res.status(200).json({ message: "Ok" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });

    }

}
const makeControllers = async (schemas) => {
    schemas.map(async (schema) => {
        await generateControllers(schema);
    })
}

const downloadProject = async (req, res) => {
    try {
        const user = await req.access_token;
        const token = req.headers['authorization'];
        const projectId = req.params.projectId
        const project = await Project.findById(projectId);
        let schemas = project.schemas;
        let roles = project.roles;
        console.log("user is", user);
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
            return res.status(500).json({ message: "Something went wrong in communicating with schema_service", error });
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
            return res.status(500).json({ message: "Something went wrong in communicating with role_service", error });
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
        // const response = await MakeRepository();
        try {
            // const projectDirectory = 'C:/Users/Rutwik/Desktop/New folder/Dev/Backend-template-generator/role_services'
            const gitCommands = [
                `dir`,
                `cd Downloads`,
                `dir`,
                'git init',
                `git add .`,
                'git commit -m "Initial commit"',
                `git remote add origin https://github.com/rutwik2514/TESTING_PREET_28.git`, // Adjust repository URL
                'git push -u origin main', // Adjust branch name if needed
            ];
    
            for (const command of gitCommands) {
                const { stdout, stderr } = await execAsync(command);
                console.log('Command:', command);
                console.log('stdout:', stdout);
                console.error('stderr:', stderr);
            }
        } catch (error) {
            console.error('Error executing script:', error);
            return res.status(500).json({ message: "Error executing push-to-github.sh script", error });
        }

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "Something went wrong" })

    }

}


//remaining controllers are makeControllers and downloadProejct controller

module.exports =
{
    newProject,
    deleteProject,
    getAllProjects,
    getProjectInfo,
    addPermission,
    deletePermission,
    getAllPermisisons,
    addRole,
    deleteRole,
    addSchema,
    deleteSchema,
    downloadProject
}
