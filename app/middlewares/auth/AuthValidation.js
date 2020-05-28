const { error } = require("../../helpers/responseApi");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

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

exports.forgotPasswordValidation = [
  check("email", "Email is required").exists()
];

exports.auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json(error("Token not found", res.statusCode));

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    if (!decoded)
      return res.status(400).json(error("Token invalid", res.statusCode));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json(error(err.message, res.statusCode));
  }
};
