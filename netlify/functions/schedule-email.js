const nodemailer = require('nodemailer');
const moment = require('moment');  // Ensure moment is imported correctly

exports.handler = async function(event, context) {
  try {
    const { email, subject, message, scheduleTime } = JSON.parse(event.body);

    // Convert scheduleTime to a Date object and calculate delay
    const sendAt = moment(scheduleTime).toDate();  // Use moment to handle the date
    const now = new Date();
    const delay = sendAt - now;

    if (delay < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Schedule time must be in the future.' })
      };
    }

    // Set a timer to send the email after the delay
    setTimeout(async () => {
      // Create a transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error.message);
      }
    }, delay);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email scheduled successfully!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to schedule email: ' + error.message })
    };
  }
};
