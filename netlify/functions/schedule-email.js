const nodemailer = require('nodemailer');
const moment = require('moment');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { email, subject, message, scheduleTime } = JSON.parse(event.body);

    // Validate input
    if (!email || !subject || !message || !scheduleTime) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'All fields are required.' })
      };
    }

    // Convert scheduleTime to a Date object and calculate delay
    const sendAt = moment(scheduleTime).toDate();
    const now = new Date();
    const delay = sendAt - now;

    if (delay < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Schedule time must be in the future.' })
      };
    }

    // Send email immediately (serverless functions can't wait for scheduled times)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);
    
    const delayMinutes = Math.round(delay / 60000);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: `✅ Email sent! (Was scheduled for ${delayMinutes} min from now, but sent immediately)` 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to process email: ' + error.message })
    };
  }
};
