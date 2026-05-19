import moongose from "mongoose";

const { Schema } = moongose;

const userSchema = new Schema(
  {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
},
{ timestamps: true }
);

export default moongose.models.User || moongose.model("User", userSchema);