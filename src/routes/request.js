const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
 try {
   const fromUserId = req.userLoggedIn._id;
   const toUserId = req.params.toUserId;
   const status = req.params.status;

   const allowedStatus = ["ignored", "interested"];
   if (!allowedStatus.includes(status)) {
     return res.status(400).json({ message: "Invalid Status Type" });
   }
   // check if user you are sending request to exists or not
   const toUserPresent = await User.findById(toUserId);
   if (!toUserPresent) {
     return res.status(404).send("User Does Not Exist !!");
   }

   
   // check for existing connection requests between from and to userIds'
   const existingConnectionRequest = await ConnectionRequest.findOne({
     $or: [
       { fromUserId: fromUserId, toUserId: toUserId },
       { fromUserId: toUserId, toUserId: fromUserId }
     ]
   });
   if (existingConnectionRequest) {
     return res.status(400).send("Connection Request Already Exists !!");
   }

   const connectionRequest = new ConnectionRequest({
     fromUserId, toUserId, status
   });

   const data = await connectionRequest.save();
   res.json({message: "Connection Request Sent Successfully ", data})
 } catch (error) {
   res.status(400).send("ERROR : " + error.message);
 }
});


module.exports = requestRouter;