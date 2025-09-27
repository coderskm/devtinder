const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, age } = req.body;
    if (!firstName || !lastName) {
      throw new Error("Name is not valid!");
    } else if (firstName.length < 2 || firstName.length > 50) {
      throw new Error("First Name should be 4 - 50 characters");
    } else if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
    } else if (age<18) {
      throw new Error("User should be atleast 18 years old");
    } 
}

module.exports = { validateSignUpData };