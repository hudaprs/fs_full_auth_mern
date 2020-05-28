const router = require("express").Router();
const {
  register,
  verify,
  login,
  getLoggedUser
} = require("../app/Controllers/Auth/AuthController");
const {
  registerValidation,
  loginValidation,
  auth
} = require("../app/middlewares/auth/AuthValidation");

router.post("/register", registerValidation, register);
router.get("/verify", verify);
router.post("/login", loginValidation, login);
router.get("/", auth, getLoggedUser);

module.exports = router;
