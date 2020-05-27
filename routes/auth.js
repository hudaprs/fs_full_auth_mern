const router = require("express").Router();
const {
  register,
  verify,
  login
} = require("../app/Controllers/Auth/AuthController");
const {
  registerValidation,
  loginValidation
} = require("../app/middlewares/auth/AuthValidation");

router.post("/register", registerValidation, register);
router.get("/verify", verify);
router.post("/login", loginValidation, login);

module.exports = router;
