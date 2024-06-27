const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { json } = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();
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
const upload = multer({ storage: storage });

router.get("/getUser", async function (req, res, next) {
  try {
    const [allUser, field] = await pool.query("SELECT * FROM user WHERE role != 'Admin'");
    res.json(allUser);
  } catch (error) {
    res.json(error);
  }
});
router.post("/getUserChat", async function (req, res, next) {
  let id = req.body.id;
  try {
    const [allUser, field] = await pool.query("SELECT * FROM user WHERE user_id != ?", [
      id
    ]);
    res.json(allUser);
  } catch (error) {
    res.json(error);
  }
});


router.post("/getUserId", async function (req, res, next) {
  try {
    let id = req.body.id;
    const [user, field] = await pool.query(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );
    res.json(user[0]);
  } catch (error) {
    res.json(error);
  }
});



router.post(
  "/editProfile/img",
  upload.single("profile"),
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      let profile = req.file;
      let u_id = req.body.id;
      let path = profile.path.substring(6);
      const [getOldImg, fields] = await pool.query(
        "SELECT img from user WHERE user_id = ?",
        [u_id]
      );
      fs.unlink(("./static" + getOldImg[0].img), err => console.log(err)); 
      const [profilepath, field] = await pool.query(
        "UPDATE user SET img = ? WHERE user_id = ?",
        [path, u_id]
      );
      const [getPath, field1] = await pool.query(
        "SELECT img FROM user WHERE user_id = ?",
        [u_id]
      );
      conn.commit();
      res.json(getPath[0].img);
    } catch (error) {
      res.json(error);
    }
  }
);

router.post(
  "/editProfile/password",
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      let u_id = req.body.id;
      let password = req.body.password;
      const [changePassword, field] = await pool.query(
        "UPDATE user SET tokens = ? WHERE user_id = ?",
        [md5(password), u_id]
      );
      conn.commit();
      res.json("success");
    } catch (error) {
      res.json(error);
    }
  }
);

router.post("/checkUser", async function (req, res, next) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let tokens = md5(password)
    const [user, field] = await pool.query(
      "SELECT * FROM user WHERE email = ? AND tokens = ?",
      [email, tokens]
    );
    if (user.length == 0) {
      res.json("error login");
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
