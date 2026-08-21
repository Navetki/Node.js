const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
    },
    author: {
      type: String,
      required: true,
      minlength: 2,
    },
    year: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("book", bookSchema);
