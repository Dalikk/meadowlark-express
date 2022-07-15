const handlers = require('./lib/handlers');
const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flashMiddleware = require('./lib/middleware/flash');
const { credentials } = require('./conifg');
const { create } = require('express-handlebars');

const app = express();
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));
app.use(flashMiddleware);

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

app.get('/newsletter-archive', handlers.newsletterArchive);

app.get('/contest/vacation-photo', handlers.vacationPhotoContest);
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax);
app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestThankYou);

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ error: err.message });
    console.log('got fields: ', fields);
    console.log('and files: ', files);
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  });
});
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if(err) return handlers.api.vacationPhotoContestError(req, res, err.message);
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

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
