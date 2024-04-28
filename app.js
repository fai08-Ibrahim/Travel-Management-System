const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set views directory and view engine to Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Routes
const cityRoutes = require('./routes/city');
const countryRoutes = require('./routes/country');

app.use('/cities', cityRoutes);
app.use('/countries', countryRoutes);

//use index template in views
app.get('/', (req, res) => {
  res.render('index');
});

// Catch 404 and handle errors
app.use((req, res, next) => {
    res.status(404).send('404: Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
