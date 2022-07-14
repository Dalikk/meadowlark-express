const fortune = require('./fortune');

exports.home = (req, res) => res.render('home');

exports.about = (req, res) =>
  res.render('about', { fortune: fortune.getFortune() });

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

exports.notFound = (req, res) => res.render('404');

exports.serverError = (req, res) => res.render('500');
