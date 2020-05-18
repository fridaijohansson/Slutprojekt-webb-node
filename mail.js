module.exports = function(toEmail, id, code){
const nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'node.mail.frida@gmail.com',
      pass: 'jagharenNodeMail'
    }
  });

  var mailOptions = {
    from: 'node.mail.frida@gmail.com',
    to: toEmail,
    subject: 'Verification..',
    html: `Link:<br>
      <a href="http://localhost:3601//confirmation/${id}/${code}">
      Verification Link</a>
    `
  };
  {/* <a href="https://frida-slutprojekt--fredricpersson2.repl.co/confirmation/${id}/${code}"></a> */}
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('err'+ error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


