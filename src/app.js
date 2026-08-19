const express = require("express");
const cors = require("cors");
const usersDb = require("./modules/users");
const booksDb = require("./modules/books");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/users", (req, res) => {
  usersDb
    .find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.get("/users/:user_id", (req, res) => {
  usersDb
    .findOne({ _id: req.params.user_id })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.post("/users", (req, res) => {
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
    .insertOne({ ...req.body }) // Исправлено: insertOne вместо insert
    .then((user) => res.status(201).json(user))
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.put("/users/:user_id", (req, res) => {
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
    .updateOne({ _id: req.params.user_id }, { $set: { ...req.body } }) // Исправлено: updateOne
    .then(() => usersDb.findOne({ _id: req.params.user_id }))
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.delete("/users/:user_id", (req, res) => {
  usersDb
    .deleteOne({ _id: req.params.user_id }) // Исправлено: deleteOne
    .then((numRemoved) => {
      if (numRemoved === 0)
        return res.status(404).json({ error: "User not found" });
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.get("/books", (req, res) => {
  booksDb
    .find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.get("/books/:book_id", (req, res) => {
  booksDb
    .findOne({ _id: req.params.book_id }) // Исправлено: _id вместо id
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.status(200).json(book);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || title.length < 2 || title.length > 20) {
    return res
      .status(400)
      .json({ error: "Заголовок должен быть от 2 до 20 символов" });
  }
  if (!author || author.length < 2 || author.length > 20) {
    return res
      .status(400)
      .json({ error: "Автор должен быть от 2 до 20 символов" });
  }
  if (!year || typeof year !== "number") {
    return res.status(400).json({ error: "Год выпуска должен быть числом" });
  }
  booksDb
    .insertOne({ ...req.body }) // Исправлено: insertOne
    .then((book) => res.status(201).json(book))
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.put("/books/:book_id", (req, res) => {
  const { title, author, year } = req.body;
  if (title && (title.length < 2 || title.length > 20)) {
    return res
      .status(400)
      .json({ error: "Заголовок должен быть от 2 до 20 символов" });
  }
  if (author && (author.length < 2 || author.length > 20)) {
    return res
      .status(400)
      .json({ error: "Автор должен быть от 2 до 20 символов" });
  }
  if (year && typeof year !== "number") {
    return res.status(400).json({ error: "Год выпуска должен быть числом" });
  }
  booksDb
    .updateOne({ _id: req.params.book_id }, { $set: { ...req.body } }) // Исправлено: updateOne
    .then(() => booksDb.findOne({ _id: req.params.book_id }))
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.status(200).json(book);
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.delete("/books/:book_id", (req, res) => {
  booksDb
    .deleteOne({ _id: req.params.book_id }) // Исправлено: deleteOne
    .then((numRemoved) => {
      if (numRemoved === 0)
        return res.status(404).json({ error: "Book not found" });
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: e.message }));
});

app.use((req, res) => {
  res.status(404).json({ error: "Запрошенный роут не найден" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://127.0.0.1:${PORT}`);
});
