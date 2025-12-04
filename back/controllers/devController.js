const Persona = require('../models/Persona');
const Producto = require('../models/Producto');

exports.nukePersonas = async (req, res) => {
    try {
        const personas = await Persona.findAll();
        let count = 0;
        for (const persona of personas) {
            await persona.destroy();
            count++;
        }
        res.json({ message: `Se han eliminado ${count} personas del servidor una por una.` });
    } catch (error) {
        console.error('Error nuking personas:', error);
        res.status(500).json({ message: 'Error al eliminar personas', error: error.message });
    }
};

exports.nukeProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        let count = 0;
        for (const producto of productos) {
            await producto.destroy();
            count++;
        }
        res.json({ message: `Se han eliminado ${count} productos del servidor uno por uno.` });
    } catch (error) {
        console.error('Error nuking productos:', error);
        res.status(500).json({ message: 'Error al eliminar productos', error: error.message });
    }
};
