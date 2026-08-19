const Datastore = require("nedb-promises");
const usersDb = Datastore.create({
  filename: "./src/data/users.db",
  autoload: true,
});

module.exports = usersDb;
