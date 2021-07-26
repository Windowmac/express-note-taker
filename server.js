const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const PORT = 3030;
const uuid = require('./helpers/uuid');

const db = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(db);
})

app.post('/api/notes', (req, res) => {
    if(req.body && req.body.title && req.body.text){
        const newNote = req.body;
        newNote.id = uuid();
        const newDbArray = db.push(req.body);
        fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(newDbArray), (err) => {throw new Error(err);});
        res.json(`Note || ${newNote.id} || added successfully 🚀`);
    } else {
        res.json('Problem adding note');
    }   
});

app.delete('/api/notes/:id', (req, res) => {
    const filteredDb = db.filter((item) => item.id !== req.params.id);
    console.log(filteredDb);
    console.log(db);
    if(filteredDb.length < db.length){
        fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(filteredDb), (err) => {throw new Error(err);});
        res.json(`Note || ${req.params.id} || removed successfully 🚀`);
    } else {
        res.json('problem removing note');
    }

});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
