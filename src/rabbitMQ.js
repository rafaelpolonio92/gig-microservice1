const amqp = require('amqplib/callback_api');

const rabbitmqURL = 'amqp://localhost';

const sendRabbitMQ = (queueName, data) => {
  amqp.connect(rabbitmqURL, (error, connection) => {
    if (error) {
      throw error;
    }
    connection.createChannel((nextError, channel) => {
      if (nextError) {
        throw nextError;
      }
      const queue = queueName;
      console.log(`Queue: ${queue}`);
      console.log(data);
      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
      console.log(`Sent following data: ${JSON.stringify(data)}`);
    });
    setTimeout(() => {
      connection.close();
    }, 500);
  });
};

module.exports = sendRabbitMQ;
