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
    callback(null, "./static/fileSubject");
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

router.post(
  "/createLesson/file",
  upload.array("fileSubject", 6),
  async function (req, res, next) {
    let course_id = req.body.course_id;
    let u_id = req.body.u_id;
    const file = req.files;
    let data = req.body.data;
    let lessonCourse = req.body.lesson;
    let pathArray = [];
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [lesson, field] = await conn.query(
        "INSERT INTO lesson(lesson, data, c_id, u_id) VALUES(?, ?, ?, ?)",
        [lessonCourse, data, course_id, u_id]
      );
      file.forEach((file, index) => {
        let path = [
          lesson.insertId,
          u_id,
          course_id,
          file.path.substring(6),
          file.originalname,
        ];
        pathArray.push(path);
      });

      const [fileSub, fil] = await conn.query(
        "INSERT INTO file(h_id, u_id, c_id, path, name) VALUES ?",
        [pathArray]
      );
      conn.commit();
      res.json("success");
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateLesson/file",
  upload.array("fileSubject", 6),
  async function (req, res, next) {
    let course_id = req.body.course_id;
    let u_id = req.body.u_id;
    let h_id = req.body.h_id;
    const file = req.files;
    let data = req.body.data;
    let lessonCourse = req.body.lesson;
    let deleteDocument = JSON.parse(req.body.deldocument);
    let pathdelete = [];
    let pathArray = [];
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [lesson, field] = await conn.query(
        "UPDATE lesson SET lesson = ?, data = ?, c_id = ?, u_id = ? WHERE h_id = ?",
        [lessonCourse, data, course_id, u_id, h_id]
      );
      file.forEach((file, index) => {
        let path = [
          h_id,
          u_id,
          course_id,
          file.path.substring(6),
          file.originalname,
        ];
        pathArray.push(path);
      });
      const [getFile, f] = await conn.query(
        "SELECT * FROM file WHERE h_id = ?",
        [h_id]
      );
      if (getFile.length == 0) {
        const [fileSub, fil] = await conn.query(
          "INSERT INTO file(h_id, u_id, c_id, path, name) VALUES ?",
          [pathArray]
        );
      } else {
        deleteDocument.forEach((value) => {
          pathdelete.push([value.f_id]);
          fs.unlink("./static" + value.path, (err) => console.log(err));
        });
        const [delFile, fl] = await conn.query(
          "DELETE FROM file WHERE f_id IN (?)",
          [pathdelete]
        );
        if(file.length != 0){
          const [file, fisl] = await conn.query(
            "INSERT INTO file(h_id, u_id, c_id, path, name) VALUES ?",
            [pathArray]
          );
        }
      }
      conn.commit();
      res.json("success");
    } catch (error) {
      next(error);
    }
  }
);
router.post("/updateLesson", async function (req, res, next) {
  let course_id = req.body.course_id;
  let u_id = req.body.u_id;
  let h_id = req.body.h_id;
  let data = req.body.data;
  let lessonCourse = req.body.lesson;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [lesson, field] = await conn.query(
      "UPDATE lesson SET lesson = ?, data = ?, c_id = ?, u_id = ? WHERE h_id = ?",
      [lessonCourse, data, course_id, u_id, h_id]
    );
    conn.commit();
    res.json("success");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
