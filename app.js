const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cats = require('./cats');

const app = express();
const port = 5000;

app.use('/static', express.static('public'));

app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', { cats: cats.getAllCats() });
});

app.get('/add-breed', (req, res) => {
    res.render('addBreed');
});

app.listen(port, () => console.log(`Server is listening on port ${port}`)); 