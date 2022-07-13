const handlers = require('./lib/handlers')
const express = require('express')
const { engine } = require('express-handlebars')

const app = express()

// Настройка механизма представлений Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static(__dirname + '/public'))

const port = process.env.PORT || 3000

app.get('/', handlers.home);

app.get('/about', handlers.about);

// Пользовательская страница 404
app.use(handlers.notFound);

// Пользовательская страница 500
app.use(handlers.serverError)

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port} ` +
    `нажмите Ctrl + C для завершения`));
