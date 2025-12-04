const http = require('http');

const makeRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/listaprecios${path}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    console.log('Raw body:', body);
                    resolve(body);
                }
            });
        });
        req.end();
    });
};

const run = async () => {
    // Assuming product ID 2 exists from previous tests
    const data = await makeRequest('/producto/2');
    console.log(JSON.stringify(data, null, 2));
};

run();
