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

const go = async () => {
  try {
    const result = await mailTransport.sendMail({
      from: '"Meadowlark Travel" <dalikk1@mail.ru>',
      to: 'dmitriev.alik1999@gmail.com, instrumenty.ykt@gmail.com',
      subject: 'Your Meadowlark Travel Tour',
      text: 'Test Mail.  ' +
        'We look forward to your visit!',
    });
    console.log('mail sent successfully: ', result);
  } catch (err) {
    console.log('could not send email: ' + err.message);
  }
};

go();
