const morgan = require("morgan");

require("dotenv").config();

const express = require("express");

const postsRoutes = require("./api/posts");
const commentsRoutes = require("./api/comments");

const app = express();
app.use(morgan("combined"));

// completely disable cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  res.send("See you at the party Richter!");
});
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
