require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dbURI = process.env.DB_URI;
const app = express();
const port = 3000;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
    app.listen(port, () => {
        console.log(`listen at port: http://localhost:${port}`);
    });
})
    .catch((err) => console.log(err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Home page');
});
app.use('/user', userRoutes);
// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(422).send(err._message);
});
