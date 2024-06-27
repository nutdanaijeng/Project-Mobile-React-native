const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { json } = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();
let alert = require("alert");

router.post("/updateRole", async function (req, res, next) {
    try {
        let u_id = req.body.id;
        let role = req.body.role;
        const [update, field] = await pool.query(
            "UPDATE user set role = ? Where user_id = ?", 
            [role, u_id]
        );
        res.json("success");
    } catch (error) {
        res.json(error);
    }
});


module.exports = router;