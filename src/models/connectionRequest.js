const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// compound index for queries involving both fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
// pre hook, a middleware, called everytime before you save document of this collection 
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself !");
    }
    next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
