const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  try {
    // Parse the request body
    const { email, message } = JSON.parse(event.body);

    // Set a fixed delay of 10 seconds
    const delay = 10000; // 10 seconds in milliseconds

    // Use a promise to delay sending the email
    await new Promise(resolve => setTimeout(resolve, delay));

    // Create a transport instance with email service
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Scheduled Email',
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully after 10 seconds' }),
    };
  } catch (error) {
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
    };
  }
};