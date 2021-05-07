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

/** create email template - filename is the template and options are */
const generateHTML = (filename, options = {}) => {
  // generate html from pug file
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inlined = juice(html); // add inline styles to email
  return inlined;
};

/** Send the templated email */
exports.send = async options => {
  const html = generateHTML(options.filename, options); // generate email template
  const text = htmlToText.fromString(html); // turn html block into text

  // create full email to send
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
