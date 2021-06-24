const express = require("express");
const router = express.Router();
const {
  findAllRecipes,
  deleteAllRecipes,
  createRecipe,
} = require("../services/recipe_service");

router.get("/", async (req, res) => {
  res.send(await findAllRecipes());
});

router.get("/new", async (req, res) => {
  await createRecipe();
  res.redirect(301, "/recipes");
});

router.get("/delete", async (req, res) => {
  await deleteAllRecipes();
  res.redirect(301, "/recipes");
});

module.exports = router;
