const express = require('express');
const { create } = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const nodemailer = require('nodemailer');
const htmlToFormattedText = require('html-to-formatted-text');

const app = express();

const credentials = require('./credentias');
const credential = require('./credentias');

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

const hbs = create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

const mailTransport = nodemailer.createTransport({
  port: 465,
  host: 'smtp.mail.ru',
  auth: {
    user: credential.sendgrid.user,
    pass: credential.sendgrid.password,
  },
});

app.post('/cart/checkout', (req, res, next) => {
  const cart = req.session.cart;
  if (!cart) next(new Error('Cart does not exists'));
  const name = req.body.name || '';
  const email = req.body.email || '';
  if (!email.match(VALID_EMAIL_REGEX))
    return res.next(new Error('Invalid email address'));
  // assign a random cart ID; normally we would use a database ID here
  cart.number = Math.random().toString().replace(/^0\.0*/, '');
  cart.billing = {
    name: name,
    email: email,
  };
  res.render('email/cart-thank-you', { layout: null, cart },
    (err, html) => {
      console.log('rendered email: ', html);
      if(err) console.log('error in email template');
      mailTransport.sendMail({
        from: '"Meadowlark Travel" <dalikk1@mail.ru>',
        to: cart.billing.email,
        subject: 'Thank You for Book your Trip with Meadowlark Travel',
        html: html,
        text: htmlToFormattedText(html),
      })
        .then(info => {
          console.log('sent! ', info);
          res.render('cart-thank-you', {cart})
        })
        .catch(err => {
          console.error('Unable to send confirmation: ' + err.message);
        });
    });
});

app.get('/', (req, res) => {
  // simulate shopping cart
  req.session.cart = {
    items: [
      { id: '82RgrqGCAHqCf6rA2vujbT', qty: 1, guests: 2 },
      { id: 'bqBtwqxpB4ohuxCBXRE9tq', qty: 1 },
    ],
  };
  res.render('04-home');
});

app.use((req, res) => {
  res.send('404 - PAGE NOT FOUND');
});

app.use((req, res) => {
  res.send('500 - SERVER ERROR');
});

app.listen(port=3000, () => {console.log(`server started on http://localhost:${port}`)});