require('dotenv').config()
const express = require('express')
const app = express()

// DataBase connect
const mongoose = require('mongoose')
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // Emitir alerta de 'pronto' para escutar na porta 3000
    app.emit('pronto')
  })
  .catch(e => console.log(e))

// Requires
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const routes = require('./routes')
const path = require('path')
const helmet = require('helmet')
const csrf = require('csurf')
// Middlewares
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware
} = require('./src/middlewares/middleware')

// Segurança
app.use(helmet())

// body params
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

// Carregar páginas estáticas
app.use(express.static(path.resolve(__dirname, 'public')))

// Cookies/sessions
const sessionOptions = session({
  secret: 'ablabluble',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

// Middlewares
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
  })
})
