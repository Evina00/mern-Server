const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://mern-client-4a70.onrender.com/",
  })
);

app.use("/api/user", authRoute);
// course route應該被jwt保護
// 如果requset header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("後端伺服器聆聽在port 8080");
});
