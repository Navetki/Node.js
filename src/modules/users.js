const Datastore = require("nedb-promises");
const usersDb = Datastore.create({
  filename: "./src/database.db",
  autoload: true,
});

module.exports = usersDb;
