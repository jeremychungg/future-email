const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

exports.handler = async (event, context) => {
  const { email, subject, message } = JSON.parse(event.body);

  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  const lpushAsync = promisify(client.lpush).bind(client);

  const emailData = JSON.stringify({ email, subject, message });

  try {
    await lpushAsync('emailQueue', emailData);
    client.quit();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email scheduled successfully' }),
    };
  } catch (error) {
    client.quit();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to schedule email' }),
    };
  }
};
