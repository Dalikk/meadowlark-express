const express = require('express')

const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('Meadowlark Travel');
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('О Meadowlark Travel');
});

// Пользовательская страница 404
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - не найдено');
});

// Пользовательская страница 500
app.use((req, res) => {
    res.type('text/plain');
    res.status(500);
    res.send('500 - ошибка сервера');
})

app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port} ` +
    `нажмите Ctrl + C для завершения`));
