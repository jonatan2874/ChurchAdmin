const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function login(req, res) {

    const { username, password } = req.body

    // prueba temporal
    if (username !== 'admin' || password !== 'admin') {
        return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
        { id: 1, username: 'admin' },
        process.env.SECRET_KEY,
        { expiresIn: '8h' }
    )

    res.json({ token })

}

module.exports = { login }