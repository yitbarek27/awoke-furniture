const sequelize = require('./server/config/database');
const User = require('./server/models/User');

async function testLogin() {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { name: 'Awoke' } });
    if (!user) {
        console.log('User "Awoke" not found');
        return;
    }
    console.log('User found:', user.name, user.role);
    console.log('Stored password hash:', user.password);
    
    const isMatch = await user.matchPassword('12345');
    console.log('Password match for "12345":', isMatch);
}

testLogin();