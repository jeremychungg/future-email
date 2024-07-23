const redis = require('redis');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
require('dotenv').config();

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const brpopAsync = promisify(client.brpop).bind(client);

const sendEmail = async (email, subject, message) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  return transporter.sendMail(mailOptions);
};

const processQueue = async () => {
  while (true) {
    try {
      const [_, emailData] = await brpopAsync('emailQueue', 0);
      const { email, subject, message } = JSON.parse(emailData);
      console.log(`Sending email to ${email}`);
      await sendEmail(email, subject, message);
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  }
};

processQueue();
