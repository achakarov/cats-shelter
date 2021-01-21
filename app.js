const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cats = require('./cats');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', { cats: cats.getAllCats(), isOnHomePage: true });
});

app.get('/add-breed', (req, res) => {
    res.render('addBreed');
});

app.post('/add-breed', (req, res) => {
    console.log(req.body)
    let catBreed = req.body.breed;
    cats.addBreed(catBreed);
    res.redirect('/');
})

app.listen(port, () => console.log(`Server is listening on port ${port}`)); 