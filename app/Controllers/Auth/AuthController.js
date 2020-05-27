const User = require("../../models/User");
const Verification = require("../../models/Verification");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../helpers/responseApi");
const { sendEmail } = require("../../helpers/nodeMailer");
const { randomString } = require("../../helpers/common");

/**
 * @desc    Register a user
 * @method  POST api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Errors Validation
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
      password,
      createdAt: new Date()
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

    res.status(201).json(
      success(
        "Register success, please check your email for activate your account",
        {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt
          }
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Verify registered user
 * @method  GET api/auth/verify
 * @access  Private
 */
exports.verify = async (req, res) => {
  const { token } = req.query;

  try {
    // Check token via query params
    if (!token)
      return res.status(404).json(error("Token not found", res.statusCode));

    let verification = await Verification.findOne({ token });

    // Check verification data
    if (!verification)
      return res.status(400).json(error("Token invalid", res.statusCode));

    // Update User
    let user = await User.findOne({ _id: verification.userId });

    // Check user
    if (!user)
      return res.status(404).json(error("User not found", res.statusCode));

    // Activate User
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
        verifiedAt: new Date()
      }
    });

    // Remove token
    await Verification.findByIdAndRemove(verification._id);

    // Send email to user
    sendEmail(
      user.email,
      "Account verification",
      `Hallo ${user.email} Your account successfully activated, enjoy!`
    );

    res
      .status(200)
      .json(success("Your account has been activated", null, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Login
 * @method  POST api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Errors Validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    let user = await User.findOne({ email });

    // Check user data
    if (!user)
      return res.status(404).json(error("Email not found", res.statusCode));

    // Check if user is not verified
    if (user && !user.isVerified)
      return res
        .status(400)
        .json(error("Your account is not active", res.statusCode));

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json(error("Password invalid", res.statusCode));

    // Generate token
    const payload = {
      user: {
        id: user._id,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(
          success(
            "Login success",
            {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                verfiedAt: user.verifiedAt
              },
              token
            },
            res.statusCode
          )
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
