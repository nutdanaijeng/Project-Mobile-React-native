const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { json } = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();
const nodemailer = require("nodemailer");
let alert = require("alert");
let md5 = require("md5");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/profiles");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.originalname.split(path.extname(file.originalname))[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({storage: storage});

router.post(
  "/register/account",
  upload.single("profile"),
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      let profile = req.file;
      let path_profile = profile.path.substring(6);
      let email = req.body.email;
      let password = req.body.password;
      let tokens = md5(password);
      if (profile == undefined) {
        profile = "./static/assets/profile.webp";
      }
      const [user, field] = await conn.query(
        "INSERT INTO user(email, tokens, img) VALUES(?, ?, ?)",
        [email, tokens, path_profile]
      );
      await conn.commit();
      return res.json("success");
    } catch (err) {
      await conn.rollback();
      next(err);
    }
  }
);

router.post("/login/account", async function (req, res, next) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let tokens = md5(password);
    const [checkuser, field] = await pool.query(
      "SELECT * FROM user WHERE email = ? AND tokens = ?",
      [email, tokens]
    );
    return res.json(checkuser[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/confirmemail", async function (req, res, next) {
  let email = req.body.email;

  const [checkEmail, field] = await pool.query(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );
  if(checkEmail.length != 0){
    return res.json("used");
  }
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let passwordLength = 5;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  try {
    const output = `
              <p>You have a Secret code</p>
              <h3>Secret code to Register</h3>
              <ul>
                  <li>Secret code : ${password}</li>
              </ul>
              `;
    // let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service : "gmail",
      auth: {
        user: "63070065@kmitl.ac.th",
        pass: "SakuraHiro8852",
      },
    });

    var mailOptions = {
      from: "63070065@kmitl.ac.th",
      to: `${email}`,
      subject: "Secret code",
      text: "Hello!",
      html: output,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
        res.json(password);
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/resetPasswordMail", async function (req, res, next) {
  let email = req.body.email;

  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let passwordLength = 5;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  try {
    const output = `
              <p>You have a Secret code</p>
              <h3>Secret code to Register</h3>
              <ul>
                  <li>Secret code : ${password}</li>
              </ul>
              `;
    // let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service : "gmail",
      auth: {
        user: "63070065@kmitl.ac.th",
        pass: "SakuraHiro8852",
      },
    });

    var mailOptions = {
      from: "63070065@kmitl.ac.th",
      to: `${email}`,
      subject: "Secret code",
      text: "Hello!",
      html: output,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
        res.json(password);
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/resetPassword", async function (req, res, next) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let tokens = md5(password);
    const [checkuser, field] = await pool.query(
      "UPDATE user SET tokens = ? WHERE email = ?",
      [tokens, email]
    );
    return res.json("success");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
