const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // creating a new instance of user model
    const user = new User(req.body);
    // saving into DB, returns promise
    await user.save();
    res.status(201).send("user saved successfully");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

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

app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.status(200).send("user updated successfully");
  } catch (error) {
    res.status(500).send("something went wrong");
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
