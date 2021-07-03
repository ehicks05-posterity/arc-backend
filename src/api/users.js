const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  softDeleteUser,
} = require("../services/user_service");

router.get("/", async (req, res) => {
  res.send(await getAllUsers());
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await getUser(id));
});

router.post("/", async (req, res) => {
  const data = req.body;
  res.send(await createUser(data));
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await softDeleteUser(id));
});

module.exports = router;
