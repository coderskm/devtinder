const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// get all the pending connection requests for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
      const userLoggedIn = req.userLoggedIn;
      
    const connectionRequests = await ConnectionRequest.find({
      toUserId: userLoggedIn._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
      
    res.status(200).json({ message: "Data fetched successfully", data: connectionRequests });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const userLoggedIn = req.userLoggedIn;
        const connectionRequests = await ConnectionRequest.find({
          $or: [
            { toUserId: userLoggedIn._id, status: "accepted" },
            { fromUserId: userLoggedIn._id, status: "accepted" },
          ],
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === userLoggedIn._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({ message: "connections found : " + connectionRequests.length, data });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const userLoggedIn = req.userLoggedIn;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; // important
        const skip = (page - 1) * limit;

        // find all connection requests which are either received or accepted 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userLoggedIn._id },
                { toUserId: userLoggedIn._id }
            ]
        }).select("fromUserId toUserId");

        // finding and hiding all users whom you have sent or accepted the connection requests from
        const hideUsersFromFeed = new Set()
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        // now find users to show in feed
        const usersToShowInFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: userLoggedIn._id } }
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).send(usersToShowInFeed);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = userRouter;