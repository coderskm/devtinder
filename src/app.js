const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // validate user data
    validateSignUpData(req);
    // encrypt password
    const { firstName, lastName, emailId, password, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10)
    // store user data
    // creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age
    });
    // saving into DB, returns promise
    await user.save();
    res.status(201).send("user saved successfully");
  } catch (error) {
    res.status(400).send("ERROR : "+ error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userData = await User.findOne({ emailId })
    if (!userData) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password); 
    if (isPasswordValid) {
      res.status(200).send("user logged in");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const userDetail = await User.findOne({ emailId: userEmail });
    if (!userDetail) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send(userDetail);
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers.length === 0) {
      res.status(404).send("no user found");
    } else {
      res.status(200).send(allUsers);
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).send("user deleted successfully");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
})

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"]
    const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update Not Applied");
    }
    if (data?.skills.length > 10) {
      throw new Error("You can Add Upto 10 Skills Only !!");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true
    });
    res.status(200).send("user updated successfully");
  } catch (error) {
    res.status(500).send("something went wrong :- "+error.message);
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established ...");
    app.listen(3000, () => console.log("server running on PORT 3000"));
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
