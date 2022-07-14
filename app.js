const handlers = require('./lib/handlers');
const express = require('express');
const bodyParser = require('body-parser');
const { create } = require('express-handlebars');

const app = express();
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());

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

app.get('/newsletter-signup', handlers.newsletterSignup);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);

app.get('/newsletter', handlers.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

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
