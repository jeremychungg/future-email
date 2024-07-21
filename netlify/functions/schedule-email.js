require('dotenv').config();
const nodemailer = require('nodemailer');
const { Client } = require('pg'); // or any database client you are using

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL // replace with your actual database connection string
});
dbClient.connect();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async function (event, context) {
  const { email, message, datetime } = JSON.parse(event.body);
  try {
    // Store email details in the database
    await dbClient.query('INSERT INTO scheduled_emails (email, message, datetime) VALUES ($1, $2, $3)', [email, message, datetime]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email scheduled successfully!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to schedule email.' })
    };
  }
};