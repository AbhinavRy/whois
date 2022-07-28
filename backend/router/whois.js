const express = require("express");
const router = express.Router();
const { getWhois } = require("../controller/whois")

router.post('/', getWhois);

module.exports = router;