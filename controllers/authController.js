const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/database");

// models
const User = require("../models/user");

exports.auth_signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.errors[0].msg || "Validation failed."
    const error = new Error(msg);
    error.statusCode = 422;
    throw error;
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPwd) => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPwd,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ success: true, msg: "User registered!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.auth_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        const error = new Error("Email not found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password.");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        config.secret,
        { expiresIn: "1h" }
      );

      const user = {
        username: loadedUser.username,
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        expiresIn: "3600"
      }

      res.status(200).json({ token: token, user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.auth_profile = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(user); // should remove the password when send back the response to the client
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
