const Datastore = require("nedb-promises");
const booksDb = Datastore.create({
  filename: "./src/books.db",
  autoload: true,
});

module.exports = booksDb;
