const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
          minLength: 2,
      maxLength: 50,
          trim: true,
      
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address :- " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "https://tinyurl.com/3kvu73ft",
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photo :- " + value);
        }
      },
    },
    about: {
      type: String,
      default: "I am awesome !",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
