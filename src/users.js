const express = require("express");
const Datastore = require("nedb-promises");
const router = express.Router();

const usersDb = Datastore.create({
  filename: "./src/database.db",
  autoload: true,
});

router.get("/users", (req, res) => {
  usersDb
    .find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: e.message }));
});

router.get("/users/:user_id", (req, res) => {
  usersDb
    .findOne({ _id: req.params.user_id })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

router.post("/users", (req, res) => {
  const { name, username } = req.body;
  if (!name || name.length < 2 || name.length > 20) {
    return res
      .status(400)
      .json({ error: "Имя должно быть от 2 до 20 символов" });
  }
  if (!username || username.length < 5) {
    return res
      .status(400)
      .json({ error: "Username должен быть не менее 5 символов" });
  }
  usersDb
    .insert({ ...req.body })
    .then((user) => res.status(201).json(user))
    .catch((e) => res.status(500).json({ error: e.message }));
});

router.put("/users/:user_id", (req, res) => {
  const { name, username } = req.body;
  if (name && (name.length < 2 || name.length > 20)) {
    return res
      .status(400)
      .json({ error: "Имя должно быть от 2 до 20 символов" });
  }
  if (username && username.length < 5) {
    return res
      .status(400)
      .json({ error: "Username должен быть не менее 5 символов" });
  }
  usersDb
    .update(
      { _id: req.params.user_id },
      { $set: { ...req.body } },
      { returnUpdatedDocs: true },
    )
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

router.delete("/users/:user_id", (req, res) => {
  usersDb
    .remove({ _id: req.params.user_id }, {})
    .then((numRemoved) => {
      if (numRemoved === 0)
        return res.status(404).json({ error: "User not found" });
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

module.exports = router;
