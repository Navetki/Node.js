const Datastore = require("nedb-promises");
const usersDb = Datastore.create({
  filename: "./src/data/users.db",
  autoload: true,
});

console.log("Connected to MongoDB");

const getUsers = (req, res) => {
  return usersDb
    .find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const getUser = (req, res) => {
  return usersDb
    .findOne({ _id: req.params.user_id })
    .then((user) => {
      if (!user)
        return res.status(404).json({ error: "Пользователь не найден" });
      res.status(200).json(user);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const createUser = (req, res) => {
  const { name, username, surname } = req.body;

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Имя должно быть строкой не менее 2 символов" });
  }
  if (!surname || surname.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Фамилия должна быть строкой не менее 2 символов" });
  }
  if (!username || username.trim().length < 5) {
    return res
      .status(400)
      .json({ error: "Username должен быть строкой не менее 5 символов" });
  }

  return usersDb
    .insert({ name, surname, username })
    .then((user) => res.status(201).json(user))
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const updateUser = (req, res) => {
  const { name, username, surname } = req.body;

  if (name !== undefined && name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Имя должно быть не менее 2 символов" });
  }
  if (surname !== undefined && surname.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Фамилия должна быть не менее 2 символов" });
  }
  if (username !== undefined && username.trim().length < 5) {
    return res
      .status(400)
      .json({ error: "Username должен быть не менее 5 символов" });
  }

  return usersDb
    .update(
      { _id: req.params.user_id },
      { $set: req.body },
      { returnUpdatedDocs: true },
    )
    .then((result) => {
      if (!result || (typeof result === "number" && result === 0)) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      const updatedUser = result.affectedDocuments || result;
      res.status(200).json(updatedUser);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const deleteUser = (req, res) => {
  return usersDb
    .remove({ _id: req.params.user_id }, {})
    .then((numRemoved) => {
      if (numRemoved === 0) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
