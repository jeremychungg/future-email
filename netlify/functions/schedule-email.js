const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  try {
    // Parse the request body
    const { email, message, datetime } = JSON.parse(event.body);

    // Calculate the delay
    const now = new Date();
    const scheduledTime = new Date(datetime);
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // If the scheduled time is in the past or now, send the email immediately
      throw new Error('Scheduled time must be in the future.');
    }

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
      body: JSON.stringify({ message: 'Email scheduled and sent successfully' }),
    };
  } catch (error) {
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
    };
  }
};