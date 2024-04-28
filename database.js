const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mets',
    waitForConnections: true,
});

const checkConnection = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Successfully connected to the database');
        connection.release(); 
    });
};

const promisePool = pool.promise();

module.exports = promisePool;