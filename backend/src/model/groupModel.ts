import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  grpProfilePic: {
    type: String,
  },
  groupMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  allMembersEncryptedGroupKeys: {
    type: Map,
    of: String,
    required: true,
  }
});

export const Group = mongoose.model("Group", groupSchema);