const express = require('express')
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
try {
    const userObj = {
      firstName: "Akshay",
      lastName: "Saini",
      emailId: "akshay@saini.com",
      password: "akshay@123",
    };

    // creating a new instance of user model
    const user = new User(userObj);
    // saving into DB, returns promise
    await user.save();
    res.status(201).send("user saved successfully");
} catch (error) {
  res.status(400).send("Error in saving user", error.message);
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


