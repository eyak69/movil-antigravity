const Persona = require('../models/Persona');

exports.crearPersona = async (req, res) => {
    try {
        const { nombre, telefono, email, direccion } = req.body;
        const persona = await Persona.create({ nombre, telefono, email, direccion });
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
};

exports.obtenerPersonas = async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.status(200).json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
};

exports.actualizarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, email, direccion } = req.body;
        const persona = await Persona.findByPk(id);
        if (!persona) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        persona.nombre = nombre || persona.nombre;
        persona.telefono = telefono || persona.telefono;
        persona.email = email || persona.email;
        persona.direccion = direccion || persona.direccion;
        await persona.save();
        res.status(200).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
};

exports.eliminarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await Persona.findByPk(id);
        if (!persona) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        await persona.destroy();
        res.status(200).json({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
};
