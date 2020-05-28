const router = require("express").Router();
const {
  register,
  verify,
  login,
  forgotPassword,
  changePassword,
  getLoggedUser
} = require("../app/Controllers/Auth/AuthController");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  changePasswordValidation,
  auth
} = require("../app/middlewares/auth/AuthValidation");

router.post("/register", registerValidation, register);
router.get("/verify", verify);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/change-password", changePasswordValidation, changePassword);
router.get("/", auth, getLoggedUser);

module.exports = router;
