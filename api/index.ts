import express from "express";
import dotenv from "dotenv";

import ExpRoutes from "../routes/router";
import mongoose from "mongoose";
import router from "../routes";
import cors from "cors";

require("dotenv").config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
// use the route as middleware
app.use(ExpRoutes);
//
// Connect to db & listen to the port once connection is successful.
mongoose
  .connect(process.env.MONGO_DB!)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening to", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to MRT backend :D" });
});
