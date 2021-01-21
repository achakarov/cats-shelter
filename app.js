const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cats = require('./cats');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const mv = require('mv');
const globalPath = __dirname.toString().replace('handlers', '');
const fs = require('fs');

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
    // console.log(req.body)
    let catBreed = req.body.breed;
    cats.addBreed(catBreed);
    res.redirect('/');
});

app.get('/add-cat', (req, res) => {
    res.render('addCat', { breeds: cats.getAllBreeds(), cats: cats.getAllCats() });
});

app.post('/add-cat', (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        let oldPath = files.upload.path;
        let newPath = path.normalize(path.join(globalPath, '/content/images/' + files.upload.name));
        mv(oldPath, newPath, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log(`Image uploaded to ${newPath}`);
        });
        fs.readFile('./data/cats.json', (err, data) => {
            if (err) {
                throw new Error(err);
            }
            cats.addCat({ id: (cats.length + 1).toString(), ...fields, image: files.upload.name });
        });
    });
    res.redirect('/');
});

app.listen(port, () => console.log(`Server is listening on port ${port}`)); 