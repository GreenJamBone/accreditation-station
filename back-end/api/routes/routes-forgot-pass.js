const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/model.user-reg');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const constants = require('../constants');


router.post('/forgot', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    mongoose.connect(constants.constants.db_url + '/' + constants.constants.db_name);
    try {
        const email = req.body.email;
        if (!email) {
          return res.send({
            status: 400,
            error: true,
            message: "Cannot be processed",
          });
        }
        const user = await User.findOne({
          email: email,
        });
        if (!user) {
          return res.send({
            success: true,
            message:
              "If that email address is in our database, we will send you an email to reset your password",
          });
        }
        let code = Math.floor(100000 + Math.random() * 900000);
        let response = await sendEmail(user.email, code);
        if (response.error) {
          return res.status(500).json({
            error: true,
            message: "Couldn't send mail. Please try again later.",
          });
        }
        let expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code;
        user.resetPasswordExpires = expiry; // 15 minutes
        await user.save();
        return res.send({
          success: true,
          message:
            "If that email address is in our database, we will send you an email to reset your password",
        });
      } catch (error) {
        console.error("forgot-password-error", error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }
    
});

router.post('/change', async (req, res) => {

    mongoose.connect(constants.constants.db_url + '/' + constants.constants.db_name);
    
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token || !newPassword || !confirmPassword) {
          return res.status(403).json({
            error: true,
            message:
              "Couldn't process request. Please provide all mandatory fields",
          });
        }
        const user = await User.findOne({
          resetPasswordToken: req.body.token,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
          return res.send({
            error: true,
            message: "Password reset token is invalid or has expired.",
          });
        }
        if (newPassword !== confirmPassword) {
          return res.status(400).json({
            error: true,
            message: "Passwords didn't match",
          });
        }
        const hash = await User.hashPassword(req.body.newPassword);
        user.password = hash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = "";
        await user.save();
        return res.send({
          success: true,
          message: "Password has been changed",
        });
      } catch (error) {
        console.error("reset-password-error", error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }
});

module.exports = router;