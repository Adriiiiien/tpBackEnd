const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const adapter = new JSONFile('db.json');

const db = new Low(adapter, { users: [], resetTokens: [] });

async function initDB() {
  await db.read();
  await db.write();
}

initDB();

module.exports = db;