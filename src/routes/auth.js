const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

// express router is like sub app inside main app.
// router used to group routes for same feature together
authRouter.post("/signup", async (req, res) => {
  try {
    // validate user data
    validateSignUpData(req);
    // encrypt password
    const { firstName, lastName, emailId, password, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // store user data
    // creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
    });
    // saving into DB, returns promise
    await user.save();
    res.status(201).send("user saved successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userData = await User.findOne({ emailId });
    if (!userData) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await userData.validatePassword(password);
    if (isPasswordValid) {
      // create JWT Token
      const token = await userData.getJWT();
      // attaching token to cookie
      res.cookie("_devtinderuser", token, { expires: new Date(Date.now() + 168 * 3600000), httpOnly: true }); // will work on http protocol
      res.status(200).send("user logged in");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});


authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("_devtinderuser", null, { expires: new Date(Date.now()) });
        res.send("user logged out");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = authRouter;