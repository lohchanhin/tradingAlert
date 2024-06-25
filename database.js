const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS groups (id TEXT)");
});

const addGroup = (groupId) => {
  db.run("INSERT INTO groups (id) VALUES (?)", [groupId], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A group with ID ${groupId} has been added to the database.`);
  });
};

const getGroups = (callback) => {
  db.all("SELECT id FROM groups", [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows.map(row => row.id));
  });
};

module.exports = { addGroup, getGroups };
