const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('--- Checking Products Table ---');
db.all('SELECT id, name, imageUrl, category FROM Products', (err, rows) => {
    if (err) {
        console.error('Error reading Products:', err.message);
    } else {
        if (rows.length === 0) {
            console.log('No products found.');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id} | Name: ${row.name} | Category: ${row.category}`);
                console.log(`  Path: "${row.imageUrl}"`);
            });
        }
    }
    db.close();
});
