const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile')
const { validate } = require("../middlewares/validate");
const { checkIfSuperAdmin } = require("../middlewares/authenticate");
const Permissions = require("../utils/permissions")

const register = async (req, res) => {
    const { email, password, confirmPassword, userType } = req.body;
    if (Permissions.RESTRICTED_ROLES.includes(userType)) {
        const response = await checkIfSuperAdmin(req);
        if (response == false) {
            return res.status(401).json({ message: "You are not authorized to register" });
        }
    }
    if(!Permissions.ROLES.includes(userType)){
        return res.status(401).json({ message: "No such user type exists" });
    }
    //validators
    if (!validate("email", email)) {
        res.status(401).json({ message: "Invalid Email, Please check again" });
        return;
    }
    else if (!validate("password", password)) {
        res.status(401).json({ message: "Invalid Password, Please check again" });
        return;
    }
    else if (password != confirmPassword) {
        res.status(401).json({ message: "Password and Confirm Password does not match" });
        return;
    }

    //checking if already exsists
    const profile = await Profile.find({ email: email });
    if (profile.length) {
        res.status(400).json({ message: "Already Registered, Please Log in" });
        return;
    }

    //adding pepper to password
    const newPassword = password + process.env.PEPPER;
    //password hashing
    const hashedPassword = await bcrypt.genSalt(10).then(salt => bcrypt.hash(newPassword, salt))

    //storing in database
    Profile.create({ email: email, password: hashedPassword, userType: userType }).then(() => {
        return res.status(200).json({ message: "Registered successfully" })
    }).catch((error) => {
        console.log("error is", error)
        res.status(500).json({ message: "Something went wrong, please try again" });
        return;
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    // validators
    if (!validate("email", email)) {
        res.status(401).json({ message: "Invalid Email, Please check again" });
        return;
    }
    else if (email === "" || password === null) {
        res.status(401).json({ message: "Must provide login credentials" });
        return;
    }

    // checking if user exists
    const profile = await Profile.findOne({ email: email });
    if (!profile) {
        res.status(404).json({ message: "User not found, Please register!" });
        return;
    }

    //adding pepper to password
    const newPassword = password + process.env.PEPPER;

    // comparing hashed password
    const validatePassword = await bcrypt.compare(newPassword, profile.password);
    if (!validatePassword) {
        res.status(401).json({ message: "Inavalid credentials, Please try again" });
        return;
    }

    // Generate JWT token
    const token = jwt.sign({
        id: profile._id,
        email: profile.email,
        userType: profile.userType
    },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ message: "Login Successful", data: token })

}

module.exports = {
    register,
    login
}