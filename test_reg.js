const axios = require('axios');

async function testRegistration() {
    try {
        // First login to get token (assuming 'Awoke' is admin and password is 'password123' based on typical seeds)
        // I'll check common names from previous check_users output: yitbare, admin, Awoke
        console.log('Attempting to login as admin...');
        let adminToken = '';
        try {
            const loginRes = await axios.post('http://localhost:5000/api/users/login', {
                name: 'Awoke',
                password: 'password123'
            });
            adminToken = loginRes.data.token;
            console.log('Login successful!');
        } catch (e) {
            console.error('Login failed, trying yitbare...');
            const loginRes = await axios.post('http://localhost:5000/api/users/login', {
                name: 'yitbare',
                password: 'password123'
            });
            adminToken = loginRes.data.token;
            console.log('Login successful for yitbare!');
        }

        console.log('Attempting to register new worker...');
        const res = await axios.post('http://localhost:5000/api/users/admin', {
            name: 'testuser_' + Date.now(),
            password: 'password123',
            role: 'sales'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        console.log('Registration Success:', res.data);
    } catch (error) {
        console.error('Registration Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRegistration();
