const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cats = require('./cats');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const mv = require('mv');
const globalPath = __dirname.toString().replace('handlers', '');
const fs = require('fs');
const catsDb = require('./data/cats.json');
const breedDb = require('./data/breeds.json');

const app = express();
const port = 5000;

app.use('/static', express.static('public'));
app.use(express.static(__dirname + '/public'));
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
        let newPath = path.normalize(path.join(globalPath, '/public/images/' + files.upload.name));
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
            cats.addCat({ id: (cats.getAllCats().length + 1).toString(), ...fields, image: files.upload.name });
        });
    });
    res.redirect('/');
});

app.get('/edit/:id?', (req, res) => {
    const id = req.params.id;
    const cat = catsDb.find(x => x.id === id);
    res.render('editCat', { cat, breeds: cats.getAllBreeds() });
});

app.post('/edit/:id?', (req, res) => {
    let form = new formidable.IncomingForm();
    console.log(req.params)
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        let oldPath = files.upload.path;
        let newPath = path.normalize(path.join(globalPath, '/public/images/' + files.upload.name));
        mv(oldPath, newPath, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log(`Image uploaded to ${newPath}`);
        });
        fs.readFile('./data/cats.json', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let allCats = JSON.parse(data);
            // console.log(allCats)
            const id = req.params.id;
            console.log(id)
            for (const cat of allCats) {
                console.log(cat.id)
                console.log(id)
                if (cat.id === id) {
                    cat.name = fields.name;
                    cat.description = fields.description;
                    cat.breed = fields.breed;
                    // console.log(files.upload.name)
                    // console.log(cat.image)
                    cat.image = files.upload.name;
                }
            }
            // console.log(allCats)
            const json = JSON.stringify(allCats);
            fs.writeFile('./data/cats.json', json, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Cat ID: ${id} successfully edited!`);
            });
        });
    });
    res.redirect('/');
});

app.get('/new-home/:id?', (req, res) => {
    const id = req.params.id;
    const cat = catsDb.find(x => x.id === id);
    const newPath = `/images/${cat.image}`;
    res.render('catShelter', { cat, newPath });
});

app.post('/new-home/:id?', (req, res) => {
    fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const id = req.params.id;
        let allCats = JSON.parse(data).filter(x => x.id !== id);
        const json = JSON.stringify(allCats);

        fs.writeFile('./data/cats.json', json, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`Cat ID: ${id} successfully adopted!`);
        });
    });
    res.redirect('/');
});

app.listen(port, () => console.log(`Server is listening on port ${port}`)); 