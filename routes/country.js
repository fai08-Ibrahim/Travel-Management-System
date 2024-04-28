const express = require('express');
const router = express.Router();
const db = require('../database');

// Display all countries
router.get('/', async (req, res) => {
    try {
        const [countries, _] = await db.query('SELECT * FROM country');
        res.render('countries', { countries });
    } catch (err) {
        console.error(err);
        res.send("Error retrieving countries");
    }
});

// Retrieve country by name
router.get('/search', async (req, res) => {
    console.log("Searching for country:", req.query.name);
    try {
        const [results] = await db.query('SELECT * FROM country WHERE name = ?', [req.query.name]);
        console.log("Search results:", results);
        if (results.length) {
            res.render('country_details', { country: results[0] });
        } else {
            res.status(404).send('No country found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving country');
    }
});


// Form to add a new country
router.get('/add', (req, res) => {
    res.render('add_country');
});

// Post request to add a new country
router.post('/add', async (req, res) => {
    const { name, weather, laws, currency, Famous_for } = req.body;
    try {
        await db.query('INSERT INTO country (name, weather, laws, currency, Famous_for) VALUES (?, ?, ?, ?, ?)', [name, weather, laws, currency, Famous_for]);
        res.redirect('/countries');
    } catch (err) {
        console.error(err);
        res.send("Failed to add new country");
    }
});

// Delete country by name
router.get('/delete/:name', async (req, res) => {
    try {
        await db.query('DELETE FROM country WHERE name = ?', [req.params.name]);
        res.redirect('/countries');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete country');
    }
});

// GET route to display the edit form for a specific country
router.get('/edit/:name', async (req, res) => {
    try {
        const [countries] = await db.query('SELECT * FROM country WHERE name = ?', [req.params.name]);
        if (countries.length) {
            res.render('edit_country', { country: countries[0] });
        } else {
            res.send('Country not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving country details');
    }
});

// POST route to submit the changes
router.post('/edit/:name', async (req, res) => {
    const { weather, laws, currency, Famous_for } = req.body;
    try {
        await db.query('UPDATE country SET weather = ?, laws = ?, currency = ?, Famous_for = ? WHERE name = ?', 
            [weather, laws, currency, Famous_for, req.params.name]);
        res.redirect('/countries');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update country');
    }
});


// Define routes for editing and deleting here...

module.exports = router;
