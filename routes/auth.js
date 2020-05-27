const router = require("express").Router();
const { register } = require("../app/Controllers/Auth/AuthController");
const RegisterValidation = require("../app/middlewares/auth/RegisterValidation");

router.post("/", RegisterValidation, register);

module.exports = router;
