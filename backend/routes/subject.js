const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { json } = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();
let alert = require("alert");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/imgSubject");
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
  "/addSubject",
  upload.single("img_subject"),
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      let teacher_id = req.body.teacherId;
      let title = req.body.title;
      let subtitle = req.body.subTitle;
      let key = req.body.key;
      let img_subject = req.file;
      let path = img_subject.path.substring(6);
      const [course, field] = await conn.query(
        "INSERT INTO course(teacher_id, title, subtitle, img, s_key) VALUES(?, ?, ?, ?, ?)",
        [teacher_id, title, subtitle, path, key]
      );
      await conn.commit();
      return res.json("success");
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/editSubjectImg",
  upload.single("img_subject"),
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      let teacher_id = req.body.teacherId;
      let title = req.body.title;
      let subtitle = req.body.subTitle;
      let key = req.body.key;
      let img_subject = req.file;
      let course_id = req.body.course_id;
      let path = img_subject.path.substring(6);

      const [getOldImg, fields] = await conn.query(
        "SELECT img from course WHERE course_id = ?",
        [course_id]
      );
      fs.unlink(("./static" + getOldImg[0].img), err => console.log(err)); 

      const [course, field] = await conn.query(
        "UPDATE course SET teacher_id = ?, title = ?, subtitle = ?, img = ?, s_key = ? WHERE course_id = ?",
        [teacher_id, title, subtitle, path, key, course_id]
      );
      await conn.commit();
      return res.json("success");
    } catch (error) {
      next(error);
    }
  }
);

router.post("/editSubject", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    let teacher_id = req.body.teacherId;
    let title = req.body.title;
    let subtitle = req.body.subTitle;
    let key = req.body.key;
    let course_id = req.body.course_id;
    const [course, field] = await conn.query(
      "UPDATE course SET teacher_id = ?, title = ?, subtitle = ?, s_key = ? WHERE course_id = ?",
      [teacher_id, title, subtitle, key, course_id]
    );
    await conn.commit();
    return res.json("success");
  } catch (error) {
    next(error);
  }
});

router.get("/getSubject", async function (req, res, next) {
  try {
    const [subject, field] = await pool.query("SELECT * FROM course");
    res.json(subject);
  } catch (error) {
    res.json(error);
  }
});

router.post("/getSubjectStudent", async function (req, res, next) {
  let s_id = req.body.id;
  try {
    const [subject, field] = await pool.query(
      "SELECT * FROM s_course WHERE s_id = ?",
      [s_id]
    );
    res.json(subject);
  } catch (error) {
    res.json(error);
  }
});

router.post("/enrollCourse", async function (req, res, next) {
  let id = req.body.id;
  let course_id = req.body.course_id;
  try {
    const [addCourse, field] = await pool.query(
      "INSERT INTO s_course(c_id, s_id) VALUES(?, ?)",
      [course_id, id]
    );
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

router.post("/DeleteCourse", async function (req, res, next) {
  let course_id = req.body.course_id;
  try {
    const [getOldImg, fields] = await pool.query(
      "SELECT img from course WHERE course_id = ?",
      [course_id]
    );
    const [delCourse, field] = await pool.query(
      "DELETE FROM course WHERE course_id = ?;",
      [course_id]
    );
    const [userInCourse, field1] = await pool.query(
      "DELETE FROM s_course WHERE c_id = ?;",
      [course_id]
    );
    fs.unlink("./static" + getOldImg[0].img, (err) => console.log(err));
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

router.post("/DeleteLesson", async function (req, res, next) {
  let lesson_id = req.body.lesson_id;
  try {
    const [delLesson, field] = await pool.query(
      "DELETE FROM lesson WHERE h_id = ?;",
      [lesson_id]
    );
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

router.post("/getMember", async function (req, res, next) {
  let course_id = req.body.course_id;
  try {
    const [member, field] = await pool.query(
      "SELECT * FROM s_course WHERE c_id = ?",
      [course_id]
    );
    res.json(member.length);
  } catch (error) {
    res.json(error);
  }
});

router.post("/createLesson", async function (req, res, next) {
  let course_id = req.body.course_id;
  let u_id = req.body.u_id;
  let data = req.body.data;
  let lessonCourse = req.body.lesson;
  try {
    const [lesson, field] = await pool.query(
      "INSERT INTO lesson(lesson, data, c_id, u_id) VALUES(?, ?, ?, ?)",
      [lessonCourse, data, course_id, u_id]
    );
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

router.post("/getLesson", async function (req, res, next) {
  let course_id = req.body.course_id;
  try {
    const [lesson, field] = await pool.query(
      "SELECT * FROM lesson WHERE c_id = ?",
      [course_id]
    );
    res.json(lesson);
  } catch (error) {
    res.json(error);
  }
});

router.post("/getFile", async function (req, res, next) {
  let course_id = req.body.course_id;
  try {
    const [file, field] = await pool.query(
      "SELECT * FROM file WHERE c_id = ?",
      [course_id]
    );
    res.json(file);
  } catch (error) {
    res.json(error);
  }
});

router.post("/getDescription", async function (req, res, next) {
  let course_id = req.body.course_id;
  try {
    const [description, field] = await pool.query(
      "SELECT * FROM dataLesson WHERE c_id = ?",
      [course_id]
    );
    res.json(description);
  } catch (error) {
    res.json(error);
  }
});


router.post("/getDescriptionLesson", async function (req, res, next) {
  let h_id = req.body.h_id;
  try {
    const [description, field] = await pool.query(
      "SELECT * FROM dataLesson WHERE h_id = ? AND type = ?",
      [h_id, "Assignment"]
    );
    res.json(description);
  } catch (error) {
    res.json(error);
  }
});


router.post("/getDescription/Assignment", async function (req, res, next) {
  let course_id = req.body.c_id;
  let d_id = req.body.d_id;
  try {
    const [assignment, field] = await pool.query(
      "SELECT * FROM dataLesson WHERE c_id = ? AND d_id = ?",
      [course_id, d_id]
    );
    res.json(assignment[0]);
  } catch (error) {
    res.json(error);
  }
});

router.post("/createDescription", async function (req, res, next) {
  let course_id = req.body.course_id;
  let h_id = req.body.h_id;
  let data = req.body.data;
  let type = req.body.type;
  let u_id = req.body.u_id;
  let time = req.body.time;
  try {
    if (time == undefined) {
      const [description, field] = await pool.query(
        "INSERT INTO dataLesson(type, data, date, h_id, u_id, c_id) VALUES(?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)",
        [type, data, h_id, u_id, course_id]
      );
    } else {
      const [description, field] = await pool.query(
        "INSERT INTO dataLesson(type, data, date, h_id, u_id, c_id) VALUES(?, ?, ?, ?, ?, ?)",
        [type, data, time, h_id, u_id, course_id]
      );
    }
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/EditLesson", async function (req, res, next) {
  let course_id = req.body.course_id;
  let u_id = req.body.u_id;
  let data = req.body.data;
  let lessonCourse = req.body.lesson;
  let h_id = req.body.h_id;
  try {
    const [lesson, field] = await pool.query(
      "UPDATE lesson SET lesson = ?, data = ?, c_id = ?, u_id = ? WHERE h_id = 7",
      [lessonCourse, data, course_id, u_id, h_id]
    );
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/EditAssignment", async function (req, res, next) {
  let course_id = req.body.c_id;
  let d_id = req.body.d_id;
  let data = req.body.data;
  let date = req.body.date;
  let u_id = req.body.u_id;
  try {
    const [lesson, field] = await pool.query(
      "UPDATE dataLesson SET data = ?, date = ?, u_id = ?, c_id = ? WHERE d_id = ?",
      [data, date, u_id, course_id, d_id]
    );
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/EditYoutube", async function (req, res, next) {
  let course_id = req.body.c_id;
  let d_id = req.body.d_id;
  let data = req.body.data;
  let u_id = req.body.u_id;
  try {
    const [lesson, field] = await pool.query(
      "UPDATE dataLesson SET data = ?, date = CURRENT_TIMESTAMP(), u_id = ?, c_id = ? WHERE d_id = ?",
      [data, u_id, course_id, d_id]
    );
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/deleteYoutube", async function (req, res, next) {
  let d_id = req.body.d_id;
  try {
    const [lesson, field] = await pool.query(
      "DELETE FROM dataLesson WHERE d_id = ?",
      [d_id]
    );
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/deleteAssignment", async function (req, res, next) {
  let d_id = req.body.d_id;
  try {
    const [lesson, field] = await pool.query(
      "DELETE FROM dataLesson WHERE d_id = ?",
      [d_id]
    );
    res.json("success");
  } catch (error) {
    next(error);
  }
});

router.post("/getYoutubeLesson", async function (req, res, next) {
  let h_id = req.body.h_id;
  try {
    const [lesson, field] = await pool.query(
      "SELECT * FROM dataLesson WHERE h_id = ? AND type = ?",
      [h_id, "Youtube"]
    );
    res.json(lesson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
