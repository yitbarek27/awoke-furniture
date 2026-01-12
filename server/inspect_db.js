const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite');

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function main() {
    const tables = await allAsync("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log('Tables:');
    for (const row of tables) {
        console.log(`- ${row.name}`);
    }

    const orderFk = await allAsync("PRAGMA foreign_key_list('Orders')");
    console.log('\nOrders foreign keys:');
    console.log(orderFk.length ? orderFk : '(none)');

    const orderItemFk = await allAsync("PRAGMA foreign_key_list('OrderItems')");
    console.log('\nOrderItems foreign keys:');
    console.log(orderItemFk.length ? orderItemFk : '(none)');

    const ordersSql = await allAsync("SELECT sql FROM sqlite_master WHERE type='table' AND name='Orders'");
    console.log('\nOrders schema:');
    console.log(ordersSql?.[0]?.sql || '(not found)');

    const usersSql = await allAsync("SELECT sql FROM sqlite_master WHERE type='table' AND name='Users'");
    console.log('\nUsers schema:');
    console.log(usersSql?.[0]?.sql || '(not found)');
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => db.close());
