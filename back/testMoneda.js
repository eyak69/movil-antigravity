const http = require('http');

const makeRequest = (method, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/monedas${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('--- Starting Moneda API Tests ---');

        // 1. Seed Data
        console.log('\n1. Seeding data...');
        const seedRes = await makeRequest('POST', '/seed');
        console.log('Status:', seedRes.status);
        console.log('Body:', seedRes.body);

        // 2. Get All Monedas
        console.log('\n2. Getting all monedas...');
        const getAllRes = await makeRequest('GET', '');
        console.log('Status:', getAllRes.status);
        console.log('Count:', getAllRes.body.length);
        console.log('Data:', getAllRes.body);

        // 3. Create Moneda
        console.log('\n3. Creating new moneda...');
        const createRes = await makeRequest('POST', '', { nombre: 'Reales', simbolo: 'R$' });
        console.log('Status:', createRes.status);
        console.log('Body:', createRes.body);
        const newId = createRes.body.id;

        // 4. Update Moneda
        console.log('\n4. Updating moneda...');
        const updateRes = await makeRequest('PUT', `/${newId}`, { nombre: 'Reales Brasileños', simbolo: 'R$' });
        console.log('Status:', updateRes.status);
        console.log('Body:', updateRes.body);

        // 5. Delete Moneda
        console.log('\n5. Deleting moneda...');
        const deleteRes = await makeRequest('DELETE', `/${newId}`);
        console.log('Status:', deleteRes.status);
        console.log('Body:', deleteRes.body);

        // 6. Verify Deletion
        console.log('\n6. Verifying deletion...');
        const getAllFinalRes = await makeRequest('GET', '');
        console.log('Count:', getAllFinalRes.body.length);

        console.log('\n--- Tests Completed ---');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

// Wait for server to start (if running locally and just restarted)
setTimeout(runTests, 2000);
