const express = require('express')
const cors = require('cors')
require('dotenv').config()

const verifyToken = require('./middleware/auth')

const authRoute = require('./routes/authRoute')

const app = express()

app.use(cors())
app.use(express.json())

// rutas publicas
app.use('/api/auth', authRoute)

// middleware que protege todo lo que siga
app.use('/api', verifyToken)

// ejemplo ruta protegida
app.get('/api/test', (req, res) => {

    res.json({
        message: 'Ruta protegida',
        user: req.user
    })

})


// const protectedRoutes = express.Router()

// protectedRoutes.use(verifyToken)

// protectedRoutes.get('/devices', ...)
// protectedRoutes.get('/clients', ...)
// protectedRoutes.post('/orders', ...)

// app.use('/api', protectedRoutes)

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.APP_PORT}`)
})

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = 3000;

// const verifyToken = require('./middleware/auth');

// // middleware
// app.use(express.json());
// app.use(cors());

// // rutas PUBLICAS
// const authRoute = require('./routes/authRoute');
// app.use('/api/auth', authRoute);

// // middleware de autenticación (todo lo que venga después queda protegido)
// app.use('/api', verifyToken);

// // rutas PRIVADAS
// // const userRoute = require('./routes/userRoute');
// // app.use('/api/users', userRoute);

// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });