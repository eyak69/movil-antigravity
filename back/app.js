const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const productoRoutes = require('./routes/productoRoutes');
const personaRoutes = require('./routes/personaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const syncRoutes = require('./routes/syncRoutes');
const devRoutes = require('./routes/devRoutes');

app.use('/api/productos', productoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/dev', devRoutes);

// Sincronizar base de datos y arrancar servidor
sequelize.sync({ force: true })
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });
