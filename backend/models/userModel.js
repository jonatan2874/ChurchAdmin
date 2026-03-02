const bcrypt = require('bcryptjs');
const dbConfig = require('../config/dbConfig');

async function register(username, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await dbConfig.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  return result.insertId;
}

async function findByUsername(username) {
  const [rows] = await dbConfig.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

module.exports = { register, findByUsername };