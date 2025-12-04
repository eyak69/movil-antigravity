const http = require('http');

const makeRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/${path}`,
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
    console.log('--- Checking Listas ---');
    const listas = await makeRequest('listas');
    console.log('Listas count:', listas.length);
    if (listas.length > 0) console.log('First Lista:', listas[0]);

    console.log('\n--- Checking Precios ---');
    const precios = await makeRequest('listaprecios');
    console.log('Precios count:', precios.length);
    if (precios.length > 0) {
        console.log('First Precio:', JSON.stringify(precios[0], null, 2));
    }
};

run();
