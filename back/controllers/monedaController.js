const Moneda = require('../models/Moneda');

const getAllMonedas = async (req, res) => {
    try {
        const monedas = await Moneda.findAll();
        res.json(monedas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMoneda = async (req, res) => {
    try {
        const { nombre, simbolo } = req.body;
        const moneda = await Moneda.create({ nombre, simbolo });
        res.status(201).json(moneda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMoneda = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, simbolo } = req.body;
        const moneda = await Moneda.findByPk(id);
        if (moneda) {
            moneda.nombre = nombre;
            moneda.simbolo = simbolo;
            await moneda.save();
            res.json(moneda);
        } else {
            res.status(404).json({ error: 'Moneda not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMoneda = async (req, res) => {
    try {
        const { id } = req.params;
        const moneda = await Moneda.findByPk(id);
        if (moneda) {
            await moneda.destroy();
            res.json({ message: 'Moneda deleted' });
        } else {
            res.status(404).json({ error: 'Moneda not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const seedMonedas = async (req, res) => {
    try {
        const initialData = [
            { nombre: 'Pesos', simbolo: '$' },
            { nombre: 'Dolares', simbolo: 'US$' },
            { nombre: 'Euros', simbolo: '€' }
        ];

        // Check if data already exists to avoid duplicates if run multiple times
        const count = await Moneda.count();
        if (count === 0) {
            await Moneda.bulkCreate(initialData);
            res.status(201).json({ message: 'Monedas seeded successfully' });
        } else {
            res.status(200).json({ message: 'Monedas already seeded' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMonedas,
    createMoneda,
    updateMoneda,
    deleteMoneda,
    seedMonedas
};
