const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { connectDb } = require("./database");
const whoisRouter = require("./router/whois");

const app = express();
connectDb();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/whois', whoisRouter);

app.listen(5000, () => {
    console.log("server running on port 5000");
});