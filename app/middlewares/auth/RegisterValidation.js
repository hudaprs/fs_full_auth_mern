const { check } = require("express-validator");

module.exports = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password minimal is 6 length").isLength({
    min: 6,
  }),
];
