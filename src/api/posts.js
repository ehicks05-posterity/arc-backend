const express = require("express");
const router = express.Router();
const {
  findAllPosts,
  deleteAllPosts,
  createPost,
} = require("../services/post_service");

router.get("/", async (req, res) => {
  res.send(await findAllPosts());
});

router.get("/new", async (req, res) => {
  await createPost();
  res.redirect(301, "/posts");
});

router.get("/delete", async (req, res) => {
  await deleteAllPosts();
  res.redirect(301, "/posts");
});

module.exports = router;
