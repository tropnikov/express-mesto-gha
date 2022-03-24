const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/usersRoutes');
const cardsRoutes = require('./routes/cardsRoutes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '623a1284706be78d96ab9db8',
  };

  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена =(' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
