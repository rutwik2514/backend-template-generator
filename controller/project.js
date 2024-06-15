const express = require("express");
const Project = require("../models/project")
const { ObjectId } = require('mongodb');

const newProject = async (req, res) => {
    try {
        //validator
        const name = req.body.name;
        if (name == undefined || name == null || !name) {
            return res.status(401).json({ message: "Should provide Name" });
        }

        //finding user
        const userId = req.access_token.id;

        //send requrest to profile_service 

        // const user = await User.findById(userId);
        // if (!user || user == undefined || user == null) {
        //     return res.status(401).json({ message: "Something went wrong !! User not found" });
        // }

        //creating project
        const newProject = await Project.create({ userId: userId, name: name, roles: [], permissions: [], restrictedRoles: [], schemas: [] });

        //axios request
        //assigning project to user
        // user.projects.push(newProject._id);
        // await user.save();

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
        // const userId = req.access_token.id;
        // const user = await User.findById(userId);
        // if (!user || user == undefined || user == null) {
        //     return res.status(401).json({ message: "Something went wrong !! User not found" });
        // }

        //deleting project
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
        console.log("Error occured in add role controller");
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
            project?.roles?.map(async (roleId) => {
                if (!roleId.equals(new ObjectId(role))) {
                    console.log("pushing roles", roleId, role);
                    tempRoles.push(roleId);
                }
            })
        );
        project.roles = tempRoles;
        await project.save();
        return res.status(200).json({ message: "Role Deleted Successfully" });

    } catch (error) {
        console.log("Error occured in add role controller");
        return res.status(500).json({ message: "Something went wrong" });
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
    deleteRole
}
