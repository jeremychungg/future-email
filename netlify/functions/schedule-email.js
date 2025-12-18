const nodemailer = require('nodemailer');
const moment = require('moment');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
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

    // For demo purposes, if the delay is less than 5 minutes, send immediately
    // Otherwise, return a message that scheduled emails require a scheduling service
    if (delay < 5 * 60 * 1000) {
      // Send immediately for short delays
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
      
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Email sent successfully! (Note: For times less than 5 minutes, emails are sent immediately)' 
        })
      };
    } else {
      // For longer delays, you would need to integrate with a scheduling service
      // like Netlify Scheduled Functions, AWS SES with delay, or a third-party service
      return {
        headers,
        body: JSON.stringify({ 
          message: `Email scheduled for ${moment(sendAt).format('LLLL')}. Note: This is a demo - for production, integrate with a scheduling service like Netlify Scheduled Functions or AWS EventBridge.` 
        })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process email: ' + error.message })
    };
  }
};
