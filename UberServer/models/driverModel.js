const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    ID: {
      type: String,
      required: true,
      minlength: 14,
      maxlength: 14,
      match: /^[0-9]{14}$/,
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Drivers", userSchema);

module.exports = userModel;
