const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: [2, "The minimum length of the name field is 2"],
    maxlength: [30, "The maximum length of the name field is 30"],
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return !value || validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator(value) {
        return !value || validator.isEmail(value);
      },
      message: 'The "email" field must be a valid email',
    },
  },
  password: {
    type: String,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
