const fortune = require('./fortune');

exports.home = (req, res) => res.render('home');

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
  res.redirect(303, '/newsletter-signup/thank-you');
};

exports.newsletterSignupThankYou = (req, res) => res.render('news-letter-signup-thank-you');

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
