const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const sendRabbitMQ = require('./rabbitMQ');

const PORT = process.env.PORT || 3000;

const app = express();
const server = require('http').createServer(app);
const io = new socketIo.Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on('sendMessage', (data) => {
    messages.push(data);
    sendRabbitMQ('message', data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
