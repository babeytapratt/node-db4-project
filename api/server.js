const express = require('express');
const helmet = require('helmet');
const server = express();

const db = require('../data/db-config');

server.use(express.json());
server.use(helmet());

server.get('/api/recipe', (req, res) => {
    db('recipe')
        .then(recipe => {
            res.status(200).json(recipe);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});

server.get('/api/ingredients', (req, res) => {
    db('ingredients as r')
        .leftJoin('recipe as r', 'r.id', 'i.recipe_id')
        .select('i.id', 'i.ingredient_name', 'r.recipe_name')
        .then(ingredients => {
            res.status(200).json(ingredients);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});

// create ingredient
server.post('/api/ingredients', (req, res) => {
    db('ingredients').insert(req.body)
        .then(ids => {
            const id = ids[0];

            db('ingredients')
                .where({ id })
                .first()
                .then(ingredient => {
                    res.status(201).json(ingredient);
                });
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});

// remove recipe
server.delete('/api/recipe/:id', (req, res) => {
    db('recipe')
        .where({ id: req.params.id })
        del()
        .then(count => {
            if (count > 0) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'Record not found' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = server;
