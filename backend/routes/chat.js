const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { json } = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();
let alert = require("alert");

router.post("/addChat", async function (req, res, next) {
  try {
    let host = req.body.host;
    let client = req.body.client;
    let chat = req.body.chat;
    const [addHost, field] = await pool.query(
      "UPDATE chat SET chat = ? WHERE host_id = ? AND client_id = ?",
      [chat, host, client]
    );
    const [addClient, field1] = await pool.query(
      "UPDATE chat SET chat = ? WHERE host_id = ? AND client_id = ?",
      [chat, client, host]
    );
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

router.post("/createChat", async function (req, res, next) {
  try {
    let host = req.body.host;
    let client = req.body.client;
    const [checkHost, f] = await pool.query(
      "SELECT * FROM chat WHERE host_id = ?, client_id = ?",
      [host, client]
    );
    const [checkClient, fa] = await pool.query(
      "SELECT * FROM chat WHERE host_id = ?, client_id = ?",
      [client, host]
    );
    if (checkHost == undefined && checkClient == undefined) {
      const [addHost, field] = await pool.query(
        "INSERT INTO chat(host_id, client_id)",
        [host, client]
      );
      const [addClient, field1] = await pool.query(
        "INSERT INTO chat(host_id, client_id)",
        [client, host]
      );
    }
    res.json("success");
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
