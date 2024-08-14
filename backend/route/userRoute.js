const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const router = express.Router();
const dotenv = require("dotenv").config()

router.get("/users", async(req, res) => {
  try {
    let allUser = await User.find()
    return res.status(200).send(allUser)
  } catch (error) {
    return res.status(500).send(`Internal server error ${error.message}`)
  }
 
});

router.get("/users/:userId", async(req, res) => {
  try {
    let _id = req.params.userId
    let allUser = await User.findOne({_id})
    return res.status(200).send(allUser)
  } catch (error) {
    return res.status(500).send(`Internal server error ${error.message}`)
  }
 
});



// Create user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNo, profession } = req.body;

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).send("Email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = new User({
      name,
      email,
      password: hashPassword,
      phoneNo,
      profession,
    });

    await createUser.save();
    return res.status(201).send("User created successfully");
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).send("Email or password is incorrect");
    }

    const checkPassword = await bcrypt.compare(password, foundUser.password);
    if (checkPassword) {
      const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).send({ msg: "User logged in successfully", token });
    } else {
      return res.status(401).send("Email or password is incorrect");
    }
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
});

// Update user
router.patch("/update/:userId", async (req, res) => {
  try {
    let _id = req.params.userId
    const {  name, email, password, phoneNo, profession } = req.body;

    const updateFields = { name, email, phoneNo, profession };
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashPassword;
    }

    const updateUser = await User.findOneAndUpdate({ _id }, updateFields, {
      new: true,
    });

    if (!updateUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User updated successfully");
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
});

// Delete user
router.delete("/delete/:userId", async (req, res) => {
  const _id  = req.params.userId;
  try {
    const deleteUser = await User.findOneAndDelete({ _id });
    if (!deleteUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User deleted successfully");
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
});

module.exports = router;
