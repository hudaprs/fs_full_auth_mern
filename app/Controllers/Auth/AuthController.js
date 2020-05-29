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
      `Visit this link for activating your account: <a href="http://localhost:3000/verify?token=${verificated.token}" target="_blank">Click Here</a>`
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

    // Check verification data
    let verification = await Verification.findOne({
      token,
      type: "userVerification"
    });
    if (!verification)
      return res.status(400).json(error("Token invalid", res.statusCode));

    // Check user
    let user = await User.findOne({ _id: verification.userId });
    if (!user)
      return res.status(404).json(error("User not found", res.statusCode));

    // Activate / Update User
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
      `Hello ${user.email} Your account successfully activated, enjoy!`
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

    // Sign token
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

/**
 * @desc    Forgot Password
 * @method  POST api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Errors Validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    let user = await User.findOne({ email }).select("-password");

    // Check User
    if (!user)
      return res.status(404).json(error("Email not found", res.statusCode));

    // Delete if there's the same token from the same user for forgotting password
    let findVerification = await Verification.findOne({
      userId: user._id,
      type: "forgotPassword"
    });
    if (findVerification)
      await Verification.findByIdAndRemove(findVerification._id);

    // Save verification forgot password token
    let verification = await new Verification({
      userId: user._id,
      token: randomString(30),
      type: "forgotPassword"
    });
    let verificated = await verification.save();

    // Send email
    sendEmail(
      user.email,
      "Forgot Password",
      `Visit this link for changing your account password: <a href="http://localhost:3000/change-password?token=${verificated.token}&type=forgotPassword" target="_blank">Click Here</a>`
    );

    res
      .status(200)
      .json(
        success(
          "Forgot password link has been sent to your email",
          null,
          res.statusCode
        )
      );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Change Password
 * @method  POST api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  const { token } = req.query;
  const { password, passwordConfirmation } = req.body;

  try {
    // Errors Validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    // Check the token
    if (!token)
      return res.status(404).json(error("Token not found", res.statusCode));

    // Check the password input
    if (password !== passwordConfirmation)
      return res
        .status(422)
        .json(error("Password confirmation did not match", res.statusCode));

    // Check the token that user haved
    let verification = await Verification.findOne({
      token,
      type: "forgotPassword"
    });
    if (!verification)
      return res.status(404).json(error("Token invalid", res.statusCode));

    // Check user
    let user = await User.findById(verification.userId);
    if (!user)
      return res.status(404).json(error("User not found", res.statusCode));

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    // Update user password
    user = await User.findByIdAndUpdate(user._id, {
      $set: {
        password: newPassword
      }
    });

    // Save user
    await user.save();

    // Send email
    sendEmail(
      user.email,
      "Forgot Password",
      `Hello ${user.name}, your password has been successfully changed.`
    );

    // Remove forgot password token
    await Verification.findByIdAndRemove(verification._id);

    res
      .status(200)
      .json(success("Your password has been changed", null, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Get Logged User
 * @method  GET api/auth
 * @access  Private
 */
exports.getLoggedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json(error("User not found", res.statusCode));

    res
      .status(200)
      .json(success(`Hello ${req.user.name}`, { user }, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
