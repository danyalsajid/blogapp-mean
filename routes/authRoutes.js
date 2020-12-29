const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/authController");
const isAuth = require("../middleware/is-auth");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists!");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().not().isEmpty().isLength({ min: 5 }),
  ],
  authController.auth_signup
);

router.post("/login", authController.auth_login);

module.exports = router;
