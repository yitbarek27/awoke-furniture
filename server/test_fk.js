const sequelize = require('./config/database');

(async () => {
    const [rows] = await sequelize.query("PRAGMA foreign_key_list('Orders')");
    console.log(rows);
    await sequelize.close();
})();
