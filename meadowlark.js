const express = require('express')
const { engine } = require('express-handlebars')

const app = express()

// Настройка механизма представлений Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static(__dirname + '/public'))

const port = process.env.PORT || 3000

const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
]

app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => {
    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    res.render('about', { fortune: randomFortune });
});

// Пользовательская страница 404
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Пользовательская страница 500
app.use((req, res) => {
    res.status(500);
    res.render('500');
})

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port} ` +
    `нажмите Ctrl + C для завершения`));
