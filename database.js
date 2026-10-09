const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Task 1: CREATE TABLE statement to create table named 'customer'
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS customer (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customerName TEXT NOT NULL,
                address TEXT,
                email TEXT NOT NULL UNIQUE,
                dateOfBirth TEXT,
                gender TEXT,
                age INTEGER,
                cardHolderName TEXT,
                cardNumber TEXT NOT NULL,
                expiryDate TEXT,
                cvv TEXT,
                timeStamp TEXT
            )
        `;

        db.run(createTableSql, (err) => {
            if (err) {
                console.error("Error creating customer table:", err.message);
            } else {
                console.log("Customer table ready.");
            }
        });
    }
});

module.exports = db;
