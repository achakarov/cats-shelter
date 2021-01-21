const fs = require('fs');
const catsData = require('./data/cats.json');
const cats = catsData.slice();
const breedsData = require('./data/breeds.json');
const breeds = breedsData.slice();

function addCat(name, description, image, breed) {
    cats.push({ name, description, image, breed });
    fs.writeFile('./data/cats.json', JSON.stringify(cats), (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Cat successfully created!');
    });
}

function addBreed(name) {
    breeds.push(name);
    fs.writeFile('./data/breeds.json', JSON.stringify(breeds), (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Breed successfully added');
    });
}

function getAllCats() {
    return cats.slice();
}

function getAllBreeds() {
    return breeds.slice();
}

module.exports = {
    addCat,
    addBreed,
    getAllCats,
    getAllBreeds
}