const handlers = require('./lib/handlers');
const express = require('express');
const { create } = require('express-handlebars');

const app = express();

const hbs = create({
  helpers: {
    section: function (name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  },
});

// Настройка механизма представлений Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

app.get('/', handlers.home);

app.get('/about', handlers.about);

// Пользовательская страница 404
app.use(handlers.notFound);

// Пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => console.log(
    `Express запущен на http://localhost:${port} ` +
        'нажмите Ctrl + C для завершения'));
} else {
  module.exports = app;
}
