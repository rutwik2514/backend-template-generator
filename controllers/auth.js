const express = require("express");
const Profile = require("../models/profile")
const register = async (req,res) =>{
    Profile.create({email:"testing@gmail.com", password:"password"})
    return res.status(200).json({message:"Registered successfully"})
}
const login = async(req,res)=>{


}

module.exports = {
    register,
    login
};