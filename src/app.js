require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server-core");
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

async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: "6.0.5",
        skipMD5: true,
      },
    });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Сервер запущен по адресу http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error("Ошибка запуска сервера:", err);
  }
}

startServer();
