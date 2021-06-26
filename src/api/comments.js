const express = require("express");
const router = express.Router();
const {
  getAllComments,
  createComment,
  deleteComment,
} = require("../services/comment_service");

router.get("/", async (req, res) => {
  res.send(await getAllComments());
});

router.get("/new", async (req, res) => {
  const data = req.body;
  await createComment(data);
  res.redirect(301, "/comments");
});

router.get("/delete", async (req, res) => {
  const { id } = req.query;
  await deleteComment(id);
  res.redirect(301, "/comments");
});

module.exports = router;
