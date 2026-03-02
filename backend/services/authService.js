const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function register(username, password) {
  return userModel.register(username, password);
}

async function login(username, password) {
  const user = await userModel.findByUsername(username);

  if (!user) {
    throw new Error('Credenciales incorrectas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales incorrectas');
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return token;
}

module.exports = { register, login };