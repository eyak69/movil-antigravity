const http = require('http');

const makeRequest = (path, method = 'POST', data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/${path}`,
            method: method,
            headers: { 'Content-Type': 'application/json' },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

const run = async () => {
    console.log('Seeding Monedas...');
    await makeRequest('monedas/seed');

    console.log('Seeding Listas...');
    await makeRequest('listas/seed');

    console.log('Creating Test Product...');
    await makeRequest('productos', 'POST', { nombre: 'Producto Test', precio: 100 });

    console.log('Done.');
};

run();
