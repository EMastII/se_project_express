const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const ConflictError = require("../utils/ConflictError");

const { JWT_SECRET = "dev-secret" } = process.env;

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name) {
    return next(new BadRequestError("Name, email and password are required"));
  }

  if (name.length < 2) {
    return next(
      new BadRequestError('The minimum length of the "name" field is 2')
    );
  }

  if (name.length > 30) {
    return next(
      new BadRequestError('The maximum length of the "name" field is 30')
    );
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError('The "email" field must be a valid email'));
  }

  if (avatar && !validator.isURL(avatar)) {
    return next(new BadRequestError("You must enter a valid URL"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("This email is already registered"));
      }
      return next(err);
    });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError('The "email" field must be a valid email'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err && err.message === "Invalid email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) =>
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }

      return res.status(200).send(user);
    })
    .catch(next);

const getProfile = (req, res, next) =>
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }

      return next(err);
    });

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const updateData = {};

  if (name !== undefined) {
    if (name.length < 2) {
      return next(
        new BadRequestError('The minimum length of the "name" field is 2')
      );
    }
    if (name.length > 30) {
      return next(
        new BadRequestError('The maximum length of the "name" field is 30')
      );
    }
    updateData.name = name;
  }

  if (avatar !== undefined) {
    if (!validator.isURL(avatar)) {
      return next(new BadRequestError("You must enter a valid URL"));
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

module.exports = {
  signup: createUser,
  signin,
  getCurrentUser,
  getProfile,
  updateUser,
  createUser,
};
