const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

exports.handler = async (event, context) => {
  try {
    const { email, subject, message, scheduleTime } = JSON.parse(event.body);

    if (!email || !subject || !message || !scheduleTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    const lpushAsync = promisify(client.lpush).bind(client);

    // Calculate the delay in milliseconds
    const scheduleDate = new Date(scheduleTime);
    const now = new Date();
    const delayMs = scheduleDate - now;

    if (delayMs <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Scheduled time must be in the future' }),
      };
    }

    const emailData = JSON.stringify({ email, subject, message, delayMs });

    await lpushAsync('emailQueue', emailData);
    client.quit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email scheduled successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to schedule email' }),
    };
  }
};
