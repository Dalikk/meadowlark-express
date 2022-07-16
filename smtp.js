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
  const largeRecipientList = new Array(2000).fill().map((_, idx) => `customer${idx}@nowhere.com`)
  const recipientsLimit = 100;
  const batches = largeRecipientList.reduce((batches, r) => {
    const lastBatch = batches[batches.length - 1];
    if (lastBatch.length < recipientsLimit)
      lastBatch.push(r);
    else
      batches.push([r]);
    return batches;
  }, [[]]);
  try {
    const results = await Promise.all(batches.map(batch =>
      mailTransport.sendMail({
        from: '"Meadowlark Travel" <dalikk1@mail.ru>',
        to: batch.join(', '),
        subject: 'Your Meadowlark Travel Tour',
        text: 'Test Mail.  ' +
          'We look forward to your visit!',
      })
    ))
    console.log(results);
  } catch (err) {
    console.log('at least one email batch failed: ' + err.message);
  }
};
go();
