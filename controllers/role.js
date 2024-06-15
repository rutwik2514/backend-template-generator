const express = require("express");
const Role = require("../model/role")
const { ObjectId } = require('mongodb');
const axios = require('axios');
const asyncWrapper = require('../middlewares/async');

const newRole = asyncWrapper(async (req, res) => {
    //validators
    const token = req.headers['authorization'];
    const {projectId}=req.params;
    const { name, permissions, isRestricted } = req.body;
    if (!projectId || projectId == null || projectId == undefined) {
        return res.status(401).json({ message: "need Project ID" })
    }
    if (!name || name == null || name == undefined) {
        return res.status(401).json({ message: "need name" })
    }

    //creating role
    const newRole = await Role.create({ name: name, projectId: projectId, permissions: permissions, isRestricted: isRestricted })
    const roleId = newRole._id;

    //updating project
    try {
        const res = await axios.post(`${process.env.PROJECT_SERVICE_URL}/addRole/${projectId}`, {
            name: name,
            role: roleId,
            isRestricted: isRestricted
        }, {
            headers: {
                Authorization: token,
            }
        })
        console.log("res is", res.body);
    } catch (error) {
        console.log("error is", error);
    }

    return res.status(200).json({ message: "OK" })

})

const deleteRole = asyncWrapper(async (req, res) => {
    const token = req.headers['authorization'];
    //validators
    const { projectId, role } = req.body;
    console.log("project id for delete is", projectId, role);
    if (!projectId || projectId == null || projectId == undefined) {
        return res.status(401).json({ message: "need Project ID" })
    }
    if (!role || role == null || role == undefined) {
        return res.status(401).json({ message: "need role id" })

    }

    const roleName = await Role.findById(role);

    //deleting role
    await Role.deleteOne({ _id: role })
    try {
        const res = await axios.delete(`${process.env.PROJECT_SERVICE_URL}/deleteRole/${projectId}`,
            {
                headers: {
                    Authorization: token,
                },
                data: {
                    name: roleName?.name,
                    role: role
                }
            })

    } catch (error) {
        console.log("token is", token);
        console.log("error is", error);
    }

    return res.status(200).json({ message: "OK" })

})

const updateRole = asyncWrapper(async (req, res) => {
    //validators
    const { role, permissions, name } = req.body;
    if (!role || role == null || role == undefined) {
        return res.status(401).json({ message: "role id required" })
    }
    const tempRole = await Role.findById(role);
    if (tempRole == null || tempRole == undefined || !tempRole) {
        return res.status(500).json({ message: "role not found" })
    }
    //updating name and permissions
    if (!(permissions === null) && !(permissions === undefined) && (permissions)) {
        tempRole.permissions = permissions;
    }
    if ((name) && !(name == null) && !(name == undefined) && (permissions)) {
        tempRole.name = name;
    }
    await tempRole.save();
    return res.status(200).json({ message: "OK" })
})

const getRoles = async(req,res) =>{
    try {
        const {roles} = req.body;
        let allRoles = [];
        await Promise.all(
            roles?.map(async (role) => {
                const roleInfo = await Role.findById(role);
                if (roleInfo != undefined && roleInfo != null && roleInfo) {
                    allRoles.push(roleInfo);
                }
            })
        )
        return res.status(200).json({ message: "Ok", roles: allRoles });

    } catch (error) {
        console.log("error in getRoles controller", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = {
    newRole,
    deleteRole,
    updateRole,
    getRoles
}