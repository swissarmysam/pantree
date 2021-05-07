/**
 * Mail handler for password resets
 */

/** Import packages */
const nodemailer = require('nodemailer'); // mail service
const pug = require('pug'); // templating engine
const juice = require('juice'); // put css styles inline on html (for email HTML)
const htmlToText = require('html-to-text'); // convert HTML into text
const promisify = require('es6-promisify'); // turn callbacks into a promise

/**
 * Pass credentials to send emails
 * This is currently done using mailtrap to replicate real emails - login for this to test is provided with documentation
 * Port/authentication details are in variables.env file
 */
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inlined = juice(html);
  return inlined;
};

exports.send = async options => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `Pantree <no-reply@pantree.co.uk>`,
    to: options.account.email,
    subject: options.subject,
    html,
    text,
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
