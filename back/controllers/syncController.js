const Persona = require('../models/Persona');
const { Op } = require('sequelize');

exports.syncPersonas = async (req, res) => {
    try {
        const { personas, lastSync } = req.body;

        // 1. Process Push (Client -> Server)
        if (personas && Array.isArray(personas)) {
            for (const p of personas) {
                await Persona.upsert({
                    id: p.id,
                    nombre: p.nombre,
                    telefono: p.telefono,
                    email: p.email,
                    direccion: p.direccion,
                    foto: p.foto,
                    updatedAt: p.updatedAt,
                    deleted: p.deleted,
                    is_synced: true
                });
            }
        }

        // 2. Process Pull (Server -> Client)
        let updatedPersonas = [];
        if (lastSync) {
            const pushedIds = personas ? personas.map(p => p.id) : [];
            updatedPersonas = await Persona.findAll({
                where: {
                    updatedAt: {
                        [Op.gt]: new Date(lastSync)
                    },
                    id: {
                        [Op.notIn]: pushedIds
                    }
                }
            });
        } else {
            // If no lastSync, fetch all (initial sync)
            updatedPersonas = await Persona.findAll();
        }

        res.json({
            message: 'Sync successful',
            syncedIds: personas ? personas.map(p => p.id) : [],
            updatedPersonas
        });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: error.stack
        });
    }
};
