const Datastore = require("nedb-promises");
const booksDb = Datastore.create({
  filename: "./src/data/books.db",
  autoload: true,
});

const getBooks = (req, res) => {
  return booksDb
    .find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const getBook = (req, res) => {
  return booksDb
    .findOne({ _id: req.params.book_id })
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Книга не найдена" });
      res.status(200).json(book);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const createBook = (req, res) => {
  const { title, author, year } = req.body;

  if (!title || title.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Заголовок должен быть строкой не менее 2 символов" });
  }
  if (!author || author.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Автор должен быть строкой не менее 2 символов" });
  }
  if (year === undefined || isNaN(Number(year))) {
    return res.status(400).json({ error: "Год выпуска должен быть числом" });
  }

  return booksDb
    .insert({ title, author, year: Number(year) })
    .then((book) => res.status(201).json(book))
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const updateBook = (req, res) => {
  const { title, author, year } = req.body;

  if (title !== undefined && title.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Заголовок должен быть не менее 2 символов" });
  }
  if (author !== undefined && author.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Автор должен быть не менее 2 символов" });
  }
  if (year !== undefined && isNaN(Number(year))) {
    return res.status(400).json({ error: "Год выпуска должен быть числом" });
  }

  const updateData = { ...req.body };
  if (year !== undefined) updateData.year = Number(year);

  return booksDb
    .update(
      { _id: req.params.book_id },
      { $set: updateData },
      { returnUpdatedDocs: true },
    )
    .then((result) => {
      if (!result || (typeof result === "number" && result === 0)) {
        return res.status(404).json({ error: "Книга не найдена" });
      }
      const updatedBook = result.affectedDocuments || result;
      res.status(200).json(updatedBook);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const deleteBook = (req, res) => {
  return booksDb
    .remove({ _id: req.params.book_id }, {})
    .then((numRemoved) => {
      if (numRemoved === 0) {
        return res.status(404).json({ error: "Книга не найдена" });
      }
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const borrowBook = (req, res) => {
  return booksDb
    .update(
      { _id: req.params.book_id },
      { $set: { userId: req.params.user_id } },
      { returnUpdatedDocs: true },
    )
    .then((result) => {
      if (!result || (typeof result === "number" && result === 0)) {
        return res.status(404).json({ error: "Книга не найдена" });
      }
      const updatedBook = result.affectedDocuments || result;
      res.status(200).json(updatedBook);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const returnBook = (req, res) => {
  return booksDb
    .update(
      { _id: req.params.book_id, userId: req.params.user_id },
      { $unset: { userId: "" } },
      { returnUpdatedDocs: true },
    )
    .then((result) => {
      if (!result || (typeof result === "number" && result === 0)) {
        return res
          .status(404)
          .json({ error: "Запись об аренде книги не найдена" });
      }
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
};
