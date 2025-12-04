const Lista = require('../models/Lista');

const getAllListas = async (req, res) => {
    try {
        const listas = await Lista.findAll();
        res.json(listas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLista = async (req, res) => {
    try {
        const { nombrecorto, nombrelargo } = req.body;
        const lista = await Lista.create({ nombrecorto, nombrelargo });
        res.status(201).json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLista = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombrecorto, nombrelargo } = req.body;
        const lista = await Lista.findByPk(id);
        if (lista) {
            lista.nombrecorto = nombrecorto;
            lista.nombrelargo = nombrelargo;
            await lista.save();
            res.json(lista);
        } else {
            res.status(404).json({ error: 'Lista not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLista = async (req, res) => {
    try {
        const { id } = req.params;
        const lista = await Lista.findByPk(id);
        if (lista) {
            await lista.destroy();
            res.json({ message: 'Lista deleted' });
        } else {
            res.status(404).json({ error: 'Lista not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const seedListas = async (req, res) => {
    try {
        const initialData = [
            { nombrecorto: 'lista dls', nombrelargo: 'Lista Dólares' },
            { nombrecorto: 'lista $', nombrelargo: 'Lista Pesos' }
        ];

        // Check if data already exists to avoid duplicates if run multiple times
        const count = await Lista.count();
        if (count === 0) {
            await Lista.bulkCreate(initialData);
            res.status(201).json({ message: 'Listas seeded successfully' });
        } else {
            res.status(200).json({ message: 'Listas already seeded' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllListas,
    createLista,
    updateLista,
    deleteLista,
    seedListas
};
