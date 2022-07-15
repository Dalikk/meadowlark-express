const fortune = require('./fortune');

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

class NewsletterSignup {
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
  }
  async save() {
    // here's where we would do the work of saving to a database
    // since this method is async, it will return a promise, and
    // since we're not throwing any errors, the promise will
    // resolve successfully
  }
}


exports.home = (req, res) => {
  res.render('home');
};

exports.about = (req, res) =>
  res.render('about', { fortune: fortune.getFortune() });

// HTML Обработка формы

exports.newsletterSignup = (req, res) => {
  res.render('newsletter-signup', { csrf: 'csrf token' });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log('Форма (из строки запроса): ' + req.query.form);
  console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
  console.log('Имя (из видимого поля формы): ' + req.body.name);
  console.log('E-mail (из видимого поля формы): ' + req.body.email);
  const name = req.body.name || '', email = req.body.email || '';
  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Check error!',
      message: 'Email is incorrect',
    };
    return res.redirect(303, '/newsletter-signup');
  }

  new NewsletterSignup({ name, email }).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
      };
      return res.redirect(303, '/newsletter-archive');
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      };
      return res.redirect(303, '/newsletter-archive');
    });
};

exports.newsletterSignupThankYou = (req, res) => res.render('news-letter-signup-thank-you');
exports.newsletterArchive = (req, res) => res.render('newsletter-archive');

// Обработка формы JSON

exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'csrf token' });
};

exports.api = {
  newsletterSignup: (req, res) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf);
    console.log('Имя (из видимого поля формы): ' + req.body.name);
    console.log('E-mail (из видимого поля формы): ' + req.body.email);
    res.send({ result: 'success' });
  },
  vacationPhotoContest: (req, res, fields, files) => {
    console.log('Данные поля: ', fields);
    console.log('Файлы: ', files);
    res.send({ result: 'success' });
  },
  vacationPhotoContestError: (req, res, message) => {
    res.send({ result: 'error', error: message });
  }
};

// Загрузка файлов

exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth()});
};

exports.vacationPhotoContestThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you');
};

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('Данные поля: ', fields);
  console.log('Файлы: ', files);
  res.redirect(303, '/contest/vacation-photo-thank-you');
};

exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo-ajax', { year: now.getFullYear(), month: now.getMonth()});
};

// Обработка ошибок

exports.notFound = (req, res) => res.render('404');

exports.serverError = (req, res) => res.render('500');
