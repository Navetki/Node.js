const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    surname: {
      type: String,
      required: true,
      minlength: 2,
    },
    username: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("user", userSchema);
