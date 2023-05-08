const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

router.post("/signup", (req, res) => {
  const { email, password, name, pic } = req.body;

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.status(404).json({
        error: err,
      });
    }
    if (user) {
      return res.status(404).json({
        message: "User already exists",
      });
    }

    bcrypt.hash(password, 12, function (err, hashedPassword) {
      User.create(
        { email, password: hashedPassword, name, pic },
        function (err, user) {
          if (err) {
            return res.status(404).json({
              error: err,
            });
          }
          transporter.sendMail({
            to: user.email,
            from: "ritikpatil566@gmail.com",
            subject: "signup success",
            html: "<h1>welcome to instagram</h1>",
          });

          res.status(200).json({
            message: "signup successfull",
            user: user,
          });
        }
      );
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      error: "Invalid email or password",
    });
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    bcrypt.compare(password, user.password, (err, doMatch) => {
      if (err) {
        return res.json({
          error: err,
        });
      }
      if (doMatch) {
        // return res.json({
        //   message: "Successfully signed in",
        // });
        const { _id, name, email, followers, following, pic } = user;
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        return res.json({
          token,
          user: { _id, name, email, followers, following, pic },
        });
      } else {
        return res.json({
          error: "Invalid email or paaword",
        });
      }
    });
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({
          error: "user does not exist with this email",
        });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "ritikpatil566@gmail.com",
          subject: "password reset",
          html: `
          
            <h2>Hi ${user.name},</h2>

           <p> There was a request to change your password! </p>

           <p>If you did not make this request then please ignore this email.</p>

           <p > Otherwise, please click this link to change your password: <a href="http://localhost:3000/reset/${token}">link</a></p>
          `,
        });

        res.json({
          message: "check your email",
        });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).json({
          error: "Try again session expires",
        });
      }
      bcrypt.hash(newPassword, 12, (err,hashedNewPassword) => {
        console.log(hashedNewPassword);
        user.password = hashedNewPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({
            message: "password updated success",
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
