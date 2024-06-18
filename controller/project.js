const express = require("express");
const Project = require("../models/project")
const { ObjectId } = require('mongodb');
const axios = require("axios");
const fs = require('fs');
const path = require('path');

// Queue imports
const { Job, QueueEvents} = require('bullmq');
const IORedis = require('ioredis');
const downloadQueue = require('./queue');

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



const producer = async (req, res) => {
    let responseSent = false;
    try {
        const user = await req.access_token;
        const token = req.headers['authorization'];
        const projectId = req.params.projectId;
        const queueResponse = await downloadQueue.add(`adding project ${projectId}`, {
            user: user,
            token: token,
            projectId: projectId
        });

        const jobId = queueResponse.id;
        const queueEvents = new QueueEvents('jobQueue');
        await queueEvents.on('completed', async ({ jobId: string }) => {
            if(!responseSent){
            responseSent = true;
            const job = await Job.fromId(downloadQueue, jobId);
            return res.status(200).json({ url:job.returnvalue });
            }
          });
        await queueEvents.on('failed', async ({ jobId: string }) => {
            if(!responseSent){
            responseSent = true;
            const job = await Job.fromId(downloadQueue, jobId);
            return res.status(200).json({ message:"An error occurred while processing your request"});
            }
          });

    } catch (error) {
        console.error('Error in producer:', error);
        if(!responseSent)
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};



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
    producer
}
