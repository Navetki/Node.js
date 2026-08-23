const Book = require("../models/book");

const getBooks = (req, res) => {
  return Book.find({})
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const getBook = (req, res) => {
  return Book.findById(req.params.book_id)
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

  return Book.create({ title, author, year: Number(year) })
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

  return Book.findByIdAndUpdate(
    req.params.book_id,
    { $set: updateData },
    { new: true },
  )
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Книга не найдена" });
      res.status(200).json(book);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const deleteBook = (req, res) => {
  return Book.findByIdAndDelete(req.params.book_id)
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Книга не найдена" });
      res.status(200).json({ status: "Success" });
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const borrowBook = (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: "Не передан bookId в теле запроса" });
  }

  return Book.findByIdAndUpdate(
    bookId,
    { $set: { userId: req.params.user_id } },
    { new: true },
  )
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Книга не найдена" });
      res.status(200).json(book);
    })
    .catch((e) => res.status(500).json({ error: "Внутренняя ошибка сервера" }));
};

const returnBook = (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: "Не передан bookId в теле запроса" });
  }

  return Book.findByIdAndUpdate(
    bookId,
    { $set: { userId: null } },
    { new: true },
  )
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Книга не найдена" });
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
