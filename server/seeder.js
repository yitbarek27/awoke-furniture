const dotenv = require('dotenv');
const User = require('./models/User');
const sequelize = require('./config/database');

dotenv.config();

const importData = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // Check if admin exists
        const adminExists = await User.findOne({ where: { email: 'admin@awoke.com' } });

        if (adminExists) {
            // Update if exists
            adminExists.name = 'Awoke';
            adminExists.email = 'admin@awoke.com';
            adminExists.password = '12345'; // Will be hashed by hooks
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin User Updated (Name: Awoke, Pwd: 12345)!');
        } else {
            // Create new
            await User.create({
                name: 'Awoke',
                email: 'admin@awoke.com',
                password: '12345',
                role: 'admin',
            });
            console.log('Admin User Created (Name: Awoke, Pwd: 12345)!');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
