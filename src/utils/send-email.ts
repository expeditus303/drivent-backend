import nodemailer from 'nodemailer';

export default function sendEmail() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'tutanota', // replace with your email provider
    auth: {
      user: 'turmadodidi@tutanota.com', // replace with your email
      pass: 'turmadod1d1!', // replace with your email password
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: 'turmadodidi@tutanota.com', // sender address
    to: 'ricardotoniett@gmail.com', // list of receivers
    subject: 'Seu pagamento foi confirmado!', // Subject line
    text: 'ticketResume', // plaintext body
    // html: '<b>Your payment was successful!</b>' // html body, if needed
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
