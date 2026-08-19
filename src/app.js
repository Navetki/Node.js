require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(usersRouter);
app.use(booksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Запрошенный роут не найден" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://127.0.0.1:${PORT}`);
});
