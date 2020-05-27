const User = require("../../models/User");
const Verification = require("../../models/Verification");
const { validationResult } = require("express-validator");
const { success, error } = require("../../helpers/responseApi");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../helpers/nodeMailer");
const { randomString } = require("../../helpers/common");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    let user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json(error("Email already registered", res.statusCode));

    user = await new User({
      name,
      email: email.toLowerCase().replace(/\s+/, ""),
      password
    });

    // Insert token to verification
    let verification = await new Verification({
      userId: user._id,
      token: randomString(30)
    });
    let verificated = await verification.save();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Send mail
    sendEmail(
      user.email,
      "Account verification",
      `Your token for activating your account: <b>${verificated.token}</b>`
    );

    const newUser = await user.save();

    res
      .status(201)
      .json(
        success(
          "Register success, please check your email for activate your account",
          newUser,
          res.statusCode
        )
      );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
