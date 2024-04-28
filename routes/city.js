const express = require('express');
const router = express.Router();
const db = require('../database');

// Display all cities
router.get('/', async (req, res) => {
    try {
        const [cities, _] = await db.query('SELECT * FROM city');
        res.render('cities', { cities });
    } catch (err) {
        console.error(err);
        res.send("Error retrieving cities");
    }
});

// Retrieve city by name
router.get('/search', async (req, res) => {
    console.log("Searching for city:", req.query.name);
    try {
        const [results] = await db.query('SELECT * FROM city WHERE City_name = ?', [req.query.name]);
        console.log("Search results:", results);
        if (results.length) {
            res.render('city_details', { city: results[0] });
        } else {
            res.status(404).send('No city found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving city');
    }
});


// Add city form
router.get('/add', (req, res) => {
    res.render('add_city');
});

// Insert city into database
router.post('/add', async (req, res) => {
    const { City_name, Avg_temperature, description, country_name } = req.body;
    try {
        await db.query('INSERT INTO city (City_name, Avg_temperature, description, country_name) VALUES (?, ?, ?, ?)', [City_name, Avg_temperature, description, country_name]);
        res.redirect('/cities');
    } catch (err) {
        console.error(err);
        res.send("Failed to add new city");
    }
});

// Delete city by name
router.get('/delete/:name', async (req, res) => {
    try {
        await db.query('DELETE FROM city WHERE City_name = ?', [req.params.name]);
        res.redirect('/cities');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete city');
    }
});

// GET route to display the edit form for a specific city
router.get('/edit/:City_name', async (req, res) => {
    try {
        const [cities] = await db.query('SELECT * FROM city WHERE City_name = ?', [req.params.City_name]);
        if (cities.length) {
            res.render('edit_city', { city: cities[0] });
        } else {
            res.send('City not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving city details');
    }
});

// POST route to submit the changes
router.post('/edit/:City_name', async (req, res) => {
    const { Avg_temperature, description, country_name } = req.body;
    try {
        await db.query('UPDATE city SET Avg_temperature = ?, description = ?, country_name = ? WHERE City_name = ?', 
            [Avg_temperature, description, country_name, req.params.City_name]);
        res.redirect('/cities');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update city');
    }
});


// Define more CRUD operations here...

module.exports = router;
