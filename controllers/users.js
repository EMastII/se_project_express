const validator = require("validator");
const User = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const signup = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Name, email and password are required" });
  }

  if (name.length < 2) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The minimum length of the "name" field is 2' });
  }

  if (name.length > 30) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The maximum length of the "name" field is 30' });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The "email" field must be a valid email' });
  }

  if (avatar && !validator.isURL(avatar)) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "You must enter a valid URL" });
  }

  return User.create({ name, avatar, email, password })
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send(userData);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "This email is already registered" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The "email" field must be a valid email' });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Invalid email or password" });
      }

      if (user.password !== password) {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Invalid email or password" });
      }

      const userData = user.toObject();
      delete userData.password;
      return res.status(200).send(userData);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const updateData = {};

  if (name !== undefined) {
    if (name.length < 2) {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'The minimum length of the "name" field is 2' });
    }
    if (name.length > 30) {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'The maximum length of the "name" field is 30' });
    }
    updateData.name = name;
  }

  if (avatar !== undefined) {
    if (!validator.isURL(avatar)) {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "You must enter a valid URL" });
    }
    updateData.avatar = avatar;
  }

  return User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The "name" field must be filled in' });
  }

  if (name.length < 2) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The minimum length of the "name" field is 2' });
  }

  if (name.length > 30) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'The maximum length of the "name" field is 30' });
  }

  if (avatar && !validator.isURL(avatar)) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "You must enter a valid URL" });
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      return res.status(BAD_REQUEST_ERROR).send({
        message: Object.values(err.errors)
          .map((error) => error.message)
          .join(", "),
      });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  signup,
  signin,
  getCurrentUser,
  updateUser,
  getUsers,
  createUser,
  getUser,
};
