const router = require("express").Router();
const {
  register,
  verify,
  login,
  forgotPassword,
  getLoggedUser
} = require("../app/Controllers/Auth/AuthController");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  auth
} = require("../app/middlewares/auth/AuthValidation");

router.post("/register", registerValidation, register);
router.get("/verify", verify);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.get("/", auth, getLoggedUser);

module.exports = router;
