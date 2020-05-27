const { check } = require("express-validator");

exports.registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password minimal is 6 length").isLength({
    min: 6
  })
];

exports.loginValidation = [
  check("email", "Email is required").exists(),
  check("password", "Password is required").not().isEmpty()
];
