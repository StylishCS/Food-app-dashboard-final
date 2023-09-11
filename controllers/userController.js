const bcrypt = require("bcrypt");
const { getUser, isVerified } = require("../services/loginService");
const { getId } = require("../services/signupService");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");
const app = express();
const userServices = require("../services/userServices");
const fs = require("fs")

async function adminLogin(req, res, next) {
  try {
    const result = await getUser(req.body.email, req.body.password);
    if (!(await bcrypt.compare(req.body.password, result[0].password))) {
      return res.status(400).json({ msg: "password isn't correct" });
    }
    delete result[0].password;
    // if (!result[0].verified) {
    //   return res
    //     .status(401)
    //     .json({ msg: "your account needs to be verified..." });
    // }
    const id = await getId(req.body.email);
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    app.use(function (req, res, next) {
      req.headers["Authorization"] = `Bearer ${token}`;
      next();
    });
    await userServices.changeStatus(id,'ACTIVE')
    res.status(200).json({ data: result, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "The email address or mobile number you entered isn't connected to an account.",
    });
  }
}


exports.getAllAdmins = async (req, res) => {
  try{
    const result = await userServices.getAllAdmins();
    res.status(200).json(result)
  }
  catch(error){
    res.status(400).json({msg: "something went wrong"})
  }
};

exports.editProfile = async (req, res) => {
  try {
    let result;
    let admin = await userServices.getAdmin(req.params.id);
    if (!admin[0]) {
      return res.status(404).json({ errors: ["Admin not found"] });
    }
    // const data = {};
    if (fs.existsSync('../upload' + admin[0].image)) {
      fs.unlinkSync('../upload/' + admin[0].image);
    }
    if (req.file) {
      req.body.image = req.file.filename;
  }

    // Object.assign(data, req.body); // Append req.body to data object

    result = await userServices.editProfile(req.body, req.params.id);

    if (result.length == 0) {
      return res.status(400).send("profile not updated");
    }
    return res.status(200).send("updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error updating profile" });
  }
};

exports.logout = async (req, res) => {
  try{
    await userServices.changeStatus(req.params.id,'IN-ACTIVE');
    res.status(200).json({ msg: "logout successfully" });
  }catch(err){
    res.status(400).json({ msg: "error logging out" });
  }
}



module.exports = {...module.exports, adminLogin };
