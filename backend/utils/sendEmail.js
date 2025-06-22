const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL.user,
      pass: config.EMAIL.pass,
    },
  });

  await transporter.sendMail({
    from: config.EMAIL.from,
    to,
    subject,
    html,
  });
};