import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path = require("path");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.listen(port)