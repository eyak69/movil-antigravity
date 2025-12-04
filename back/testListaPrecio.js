const http = require('http');

const makeRequest = (method, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/listaprecios${path}`,
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

// Helper to create a product for testing
const createProduct = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/productos',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.write(JSON.stringify({ nombre: 'Producto Test Precio', precio: 100 }));
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('--- Starting ListaPrecio API Tests ---');

        // 0. Setup: Seed Data first to ensure IDs exist
        console.log('\n0. Seeding data...');
        // Note: These paths are relative to /api/listaprecios, so we go up to root
        // Actually, makeRequest hardcodes /api/listaprecios. Let's use a custom helper or just assume we can hit the other endpoints.
        // Easier to just use http.request manually for seeds or adjust makeRequest.
        // Let's adjust makeRequest to take full path if needed, but for now I'll just use a quick hack to call the seed endpoints.

        const seed = (path) => {
            return new Promise((resolve, reject) => {
                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: path,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                };
                const req = http.request(options, (res) => {
                    res.on('data', () => { });
                    res.on('end', () => resolve());
                });
                req.end();
            });
        }

        await seed('/api/monedas/seed');
        await seed('/api/listas/seed');

        console.log('Creating test product...');
        const product = await createProduct();
        const productoId = product.id;
        console.log('Product created with ID:', productoId);

        const listaId = 1;
        const monedaId = 1;

        // 1. Add Price A
        console.log('\n1. Adding Price A ($100)...');
        const priceA = await makeRequest('POST', '', { productoId, listaId, monedaId, precio: 100 });
        console.log('Status:', priceA.status);
        console.log('Body:', priceA.body);

        // 2. Verify Active Price
        console.log('\n2. Verifying Active Price...');
        const activeRes1 = await makeRequest('GET', `/producto/${productoId}`);
        console.log('Active Price:', activeRes1.body[0].precio);
        if (activeRes1.body[0].precio != 100) throw new Error('Price mismatch');

        // 3. Add Price B (Update)
        console.log('\n3. Adding Price B ($120) - Should close old price...');
        const priceB = await makeRequest('POST', '', { productoId, listaId, monedaId, precio: 120 });
        console.log('Status:', priceB.status);
        console.log('Body:', priceB.body);

        // 4. Verify Active Price Updated
        console.log('\n4. Verifying Active Price Updated...');
        const activeRes2 = await makeRequest('GET', `/producto/${productoId}`);
        console.log('Active Price:', activeRes2.body[0].precio);
        if (activeRes2.body[0].precio != 120) throw new Error('Price mismatch');

        // 5. Verify History
        console.log('\n5. Verifying History...');
        const historyRes = await makeRequest('GET', `/producto/${productoId}/history`);
        console.log('History Count:', historyRes.body.length);
        console.log('History Data:', historyRes.body.map(p => ({ precio: p.precio, fechaAlta: p.fechaAlta, fechaBaja: p.fechaBaja })));

        if (historyRes.body.length !== 2) throw new Error('History count mismatch');
        const closedPrice = historyRes.body.find(p => p.precio == 100);
        if (!closedPrice.fechaBaja) throw new Error('Old price not closed');

        console.log('\n--- Tests Completed ---');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

// Wait for server to restart
setTimeout(runTests, 2000);
