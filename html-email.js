const nodemailer = require('nodemailer');

const credential = require('./credentias');

const mailTransport = nodemailer.createTransport({
  port: 465,
  host: 'smtp.mail.ru',
  auth: {
    user: credential.sendgrid.user,
    pass: credential.sendgrid.password,
  },
});

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"Meadowlark Travel" <dalikk1@mail.ru>',
      to: 'dmitriev.alik1999@gmail.com',
      subject: 'Your Meadowlark Travel Tour',
      html: '<h1>Meadowlark Travel</h1>\n<p>Thanks for book your trip with ' +
        'Meadowlark Travel.  <b>We look forward to your visit!</b>',
      text: 'Thank you for booking your trip with Meadowlark Travel.  ' +
        'We look forward to your visit!',
    })
    console.log('mail sent successfully: ', result)
  } catch(err) {
    console.log('could not send mail: ' + err.message)
  }
}

go()
