const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/usersRoutes');
const cardsRoutes = require('./routes/cardsRoutes');
const {
  login,
  createUser,
} = require('./controllers/usersController');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена =(' });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
