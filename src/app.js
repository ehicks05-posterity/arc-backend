require("dotenv").config();

const express = require("express");

const recipesRoutes = require("./api/recipes");

const app = express();

app.get("/", (req, res) => {
  res.send("See you at the party Richter!");
});
app.use("/recipes", recipesRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
