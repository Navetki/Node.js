const router = require("express").Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} = require("../controllers/books");

router.get("/books", getBooks);
router.get("/books/:book_id", getBook);
router.post("/books", createBook);
router.put("/books/:book_id", updateBook);
router.delete("/books/:book_id", deleteBook);

router.post("/users/:user_id/books/:book_id", borrowBook);
router.delete("/users/:user_id/books/:book_id", returnBook);

module.exports = router;
