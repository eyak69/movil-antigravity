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
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
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

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const productNames = [
    'iPhone 15', 'Samsung Galaxy S24', 'MacBook Pro', 'Dell XPS', 'Sony Headphones',
    'Nintendo Switch', 'PlayStation 5', 'Xbox Series X', 'iPad Air', 'Kindle Paperwhite',
    'Logitech Mouse', 'Mechanical Keyboard', 'Monitor 4K', 'USB-C Hub', 'External SSD',
    'Smart Watch', 'Fitness Tracker', 'Bluetooth Speaker', 'Drone', 'Action Camera',
    'Gaming Chair', 'Desk Lamp', 'Wireless Charger', 'Power Bank', 'HDMI Cable',
    'Router WiFi 6', 'Webcam 1080p', 'Microphone USB', 'Graphics Card', 'Processor',
    'RAM 16GB', 'Motherboard', 'Cooling Fan', 'PC Case', 'Power Supply',
    'Tablet Android', 'E-Reader', 'Smart Home Hub', 'Smart Bulb', 'Smart Plug',
    'Robot Vacuum', 'Air Purifier', 'Coffee Maker', 'Blender', 'Toaster',
    'Microwave', 'Electric Kettle', 'Hair Dryer', 'Electric Toothbrush', 'Shaver'
];

const run = async () => {
    try {
        console.log('--- Starting Full Data Seeding ---');

        // 1. Seed Catalogs (Idempotent)
        console.log('Seeding Monedas...');
        await makeRequest('monedas/seed');
        console.log('Seeding Listas...');
        await makeRequest('listas/seed');

        // 2. Fetch Catalogs to get IDs
        const monedas = await makeRequest('monedas', 'GET');
        const listas = await makeRequest('listas', 'GET');

        if (!monedas.length || !listas.length) {
            console.error('Error: Monedas or Listas not found. Aborting.');
            return;
        }

        console.log(`Found ${monedas.length} Monedas and ${listas.length} Listas.`);

        // 3. Create Products and Prices
        console.log('Creating 50 Products and Prices...');

        for (let i = 0; i < 50; i++) {
            const name = productNames[i] || `Producto ${i + 1}`;
            const basePrice = getRandomInt(10, 2000);

            // Create Product
            const product = await makeRequest('productos', 'POST', {
                nombre: name,
                precio: basePrice
            });

            if (product && product.id) {
                // Create a price for a random list and currency
                const randomLista = listas[getRandomInt(0, listas.length - 1)];
                const randomMoneda = monedas[getRandomInt(0, monedas.length - 1)];
                const priceValue = basePrice * (getRandomInt(80, 120) / 100); // +/- 20%

                const createdPrice = await makeRequest('listaprecios', 'POST', {
                    productoId: product.id,
                    listaId: randomLista.id,
                    monedaId: randomMoneda.id,
                    precio: parseFloat(priceValue.toFixed(2))
                });

                // Randomly soft delete some prices (20% chance)
                if (createdPrice && createdPrice.id && Math.random() < 0.2) {
                    await makeRequest(`listaprecios/${createdPrice.id}`, 'DELETE');
                }

                // Occasionally add a second price for the same product in a different list
                if (Math.random() > 0.7) {
                    const otherLista = listas.find(l => l.id !== randomLista.id);
                    if (otherLista) {
                        await makeRequest('listaprecios', 'POST', {
                            productoId: product.id,
                            listaId: otherLista.id,
                            monedaId: randomMoneda.id, // Same currency
                            precio: parseFloat((basePrice * 1.1).toFixed(2)) // Slightly higher
                        });
                    }
                }
            }
            process.stdout.write('.');
        }
        console.log('\nDone. Database populated.');

    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

run();
