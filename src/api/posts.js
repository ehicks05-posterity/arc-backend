const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  adminCreatePost,
  adminDeleteEverything,
} = require("../services/post_service");

router.get("/", async (req, res) => {
  res.send(await getAllPosts());
});

router.get("/new", async (req, res) => {
  await adminCreatePost();
  res.redirect(301, "/posts");
});

router.get("/delete", async (req, res) => {
  await adminDeleteEverything();
  res.redirect(301, "/posts");
});

module.exports = router;
