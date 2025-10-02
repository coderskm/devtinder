const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
