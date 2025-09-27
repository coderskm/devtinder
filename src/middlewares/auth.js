const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req, res, next) => {
try {
  // read the token from req cookies
  const cookies = req.cookies;
    const { _devtinderuser } = cookies;
    if (!_devtinderuser) {
        throw new Error("Token Not Valid !!");
    }
  // validate the token
  const decodedCookieObject = jwt.verify(_devtinderuser, "7cfe96f167e4e4b327fbf9f19485d0d9");
  // find the user
  const { _id } = decodedCookieObject;
  const userData = await User.findById(_id);
  // continue the flow if user present otherwise throw an error
  if (!userData) {
    throw new Error("user not found !");
    }
    // attach user found to request
    req.userLoggedIn = userData;
  next();
} catch (error) {
    res.status(400).send("ERROR: "+ error.message);
}
}

module.exports = { userAuth };