const express = require("express");
const Project = require("../models/project")
const User = require("../models/profile")
const { ObjectId } = require('mongodb');

const newProject = async (req, res) => {
    //validator
    const name = req.body.name;
    if (name == undefined || name == null || !name) {
        return res.status(401).json({ message: "Should provide Name" });
    }

    //finding user
    const userId = req.access_token.id;
    const user = await User.findById(userId);
    if (!user || user == undefined || user == null) {
        return res.status(401).json({ message: "Something went wrong !! User not found" });
    }

    //creating project
    const newProject = await Project.create({ userId: userId, name: name, roles: [], permissions: [] });

    //assigning project to user
    user.projects.push(newProject._id);
    await user.save();

    return res.status(200).json({ message: "OK", id:newProject._id});
}

const deleteProject = async(req,res) =>{
     //validator
     const {projectId} = req.body;
 
     //finding user
     const userId = req.access_token.id;
     const user = await User.findById(userId);
     if (!user || user == undefined || user == null) {
         return res.status(401).json({ message: "Something went wrong !! User not found" });
     }
 
     //deleting project
     await Project.deleteOne({_id:projectId});
 
     //deleting project to user
     let tempProjects = [];
     for(let i =0; i < user.projects.length; i++){
        if(!user.projects[i].equals(new ObjectId(projectId))){
            tempProjects.push(user.projects[i]);
        }
     }
     user.projects=tempProjects;
     await user.save();
 
     return res.status(200).json({ message: "OK" });
}


//get all projects
const getAllProjects = async(req,res) =>{
    const userId = req.access_token.id;
    const user = await User.findById(userId).populate('projects');
    const projects = user.projects;
    if(projects){
        return res.status(200).json({message:"Ok", projects:projects});
    }
    else{
        return res.status(500).json({message:"Something went wrong"});

    }
}

const getProjectInfo = async(req,res) =>{
    // const {projectId} = req.body;
    const projectId = req.params.projectId;
    if(projectId==null || projectId==undefined || !projectId){
        return res.status(500).json({message:"Need project Id"});

    }
    console.log("projectId is", projectId);
    const project = await Project.findById(projectId).populate('roles');
    if(project){
        return res.status(200).json({message:"Ok", project:project});
    }
    else{
        return res.status(500).json({message:"Something went wrong"});

    }
}

//add permissions to project
const addPermission = async (req, res) => {
    //validators
    const { projectId,permission } = req.body;
    if (projectId == null || projectId == undefined || !projectId) {
        return res.status(401).json({ message: "need project id" })
    }
    //finding project
    const project = await Project.findById(projectId);
    if(!project || project == null || project == undefined){
        return res.status(401).json({ message: "Project not found" })
    }
    //adding permission
    project.permissions.push(permission);
    await project.save();
    return res.status(200).json({ message: "OK" })
}


//delete permissin from project
const deletePermission = async(req,res) =>{
    //validators
    const { projectId,permission } = req.body;
    if (projectId == null || projectId == undefined || !projectId) {
        return res.status(401).json({ message: "need project id" })
    }

    //finding project
    const project = await Project.findById(projectId);
    if(!project || project == null || project == undefined){
        return res.status(401).json({ message: "Project not found" })
    }

    //deleting permissions
    let tempPermissions = [];
    for(let i = 0; i < project.permissions.length; i++){
        if(project.permissions[i]!==permission){
            tempPermissions.push(project.permissions[i]);
        }
    }
    project.permissions=tempPermissions;
    await project.save();
    return res.status(200).json({ message: "OK" })
}
module.exports = {
    newProject,
    addPermission,
    deletePermission,
    deleteProject,
    getAllProjects,
    getProjectInfo
}