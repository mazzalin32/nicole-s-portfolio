const Database = require('better-sqlite3');
const db = new Database('dev.db');
const row = db.prepare('SELECT * FROM SiteSettings').get();
console.log(JSON.stringify(row, null, 2));
