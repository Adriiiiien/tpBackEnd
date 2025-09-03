const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return data ? JSON.parse(data) : [];
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
  return readUsers().find(u => u.email === email);
}

function findUserByToken(token) {
  return readUsers().find(u => u.verificationToken === token);
}

function addUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

function updateUser(email, updates) {
  const users = readUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    writeUsers(users);
    return true;
  }
  return false;
}

module.exports = {
  readUsers,
  writeUsers,
  findUserByEmail,
  findUserByToken,
  addUser,
  updateUser
};
