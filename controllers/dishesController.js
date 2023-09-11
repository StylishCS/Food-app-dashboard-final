const bcrypt = require("bcrypt");
const { getUser, isVerified } = require("../services/loginService");
const { getId } = require("../services/signupService");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");
const dishServices = require("../services/dishesServices");
const fs = require("fs")

exports.getAllDishes = async (req, res) => {
  try {
    let result = await dishServices.getAll();
    if (result.length == 0) {
      return res.status(404).send("No items found..");
    }
    result.map(
      (res) => (res.image = "https://" + req.hostname + "/" + res.image)
    );
    res.status(200).send(result);
  } catch (error) {
    throw error;
  }
};

exports.getDish = async (req, res) => {
  try {
    const result = await dishServices.getDish(req.params.id);
    if (result.length == 0) {
      return res.status(404).send("No items found..");
    }
    result[0].image = "https://" + req.hostname + "/" + result[0].image;
    res.status(200).send(result);
  } catch (error) {
    throw error;
  }
};

exports.addDish = async (req, res) => {
  try {
    // const errors = req.validationErrors();
    // if (!errors) {
    //   return res.status(400).json({ errors: "error" });
    // }

    if (!req.file) {
      // Check if image file exists
      return res.status(400).json({
        errors: [{ msg: "Image is Required" }],
      });
    }

    const { nanoid } = require("nanoid");
    const nId = nanoid(10);

    // INSERT NEW DISH
    const dishData = {
      id: nId,
      name: req.body.name,
      stock: req.body.stock,
      price: req.body.price,
      image: req.file.filename, // Use the filename of the uploaded image
      category: req.body.category,
    };

    await dishServices.add(dishData);

    res.status(201).json({
      msg: "Dish added successfully",
    });
  } catch (err) {
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.updateDish = async (req, res) => {
  try {
    let result;
    let dishe = await dishServices.getDish(req.params.id);
    if (!dishe[0]) {
      return res.status(404).json({ errors: ["Dishe not found"] });
    }
    // const data = {};
    if (fs.existsSync("../upload" + dishe[0].image)) {
      fs.unlinkSync("../upload/" + dishe[0].image);
    }
    if (req.file) {
      req.body.image = req.file.filename;
    }

    result = await dishServices.updateDish(req.body, req.params.id);

    if (result.length == 0) {
      return res.status(400).send("dishe not updated");
    }
    return res.status(200).send("updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error updating dishe" });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    await dishServices.deleteDish(req.params.id);
    res.status(204).send("dish deleted successfully");
  } catch (error) {
    res.status(404).json({
      status: "fail",
      msg: "cannot find dish",
    });
  }
};
