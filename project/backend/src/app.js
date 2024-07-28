import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
})); // json data

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
})); // url theke data

app.use(express.static("public")); // static file configuration
app.use(cookieParser()); // client er browser cookie te read write korte parbe server

export {app};