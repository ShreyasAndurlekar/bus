 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const accountsRouter = require('./routes/accounts');
const authRouter = require('./routes/auth');
require('dotenv').config();


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dbURI = process.env.DATABASE_URL;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));


app.use('/accounts', accountsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
