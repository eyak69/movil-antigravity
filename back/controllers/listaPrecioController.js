const ListaPrecio = require('../models/ListaPrecio');
const Producto = require('../models/Producto');
const Lista = require('../models/Lista');
const Moneda = require('../models/Moneda');
const { Op } = require('sequelize');

const getCurrentPreciosByProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const precios = await ListaPrecio.findAll({
            where: {
                productoId: id,
                fechaBaja: null
            },
            include: [
                { model: Lista },
                { model: Moneda }
            ]
        });
        res.json(precios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCurrentPrecios = async (req, res) => {
    try {
        const precios = await ListaPrecio.findAll({
            where: {
                fechaBaja: null
            },
            include: [
                { model: Producto },
                { model: Lista },
                { model: Moneda }
            ]
        });
        res.json(precios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistoryByProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const precios = await ListaPrecio.findAll({
            where: {
                productoId: id
            },
            include: [
                { model: Lista },
                { model: Moneda }
            ],
            order: [['fechaAlta', 'DESC']]
        });
        res.json(precios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addPrecio = async (req, res) => {
    try {
        const { productoId, listaId, monedaId, precio } = req.body;

        // 1. Find active price for this combination
        const activePrice = await ListaPrecio.findOne({
            where: {
                productoId,
                listaId,
                monedaId,
                fechaBaja: null
            }
        });

        // 2. Close it if exists
        if (activePrice) {
            activePrice.fechaBaja = new Date();
            await activePrice.save();
        }

        // 3. Create new price
        const newPrice = await ListaPrecio.create({
            productoId,
            listaId,
            monedaId,
            precio,
            fechaAlta: new Date()
        });

        res.status(201).json(newPrice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCurrentPrecios,
    getCurrentPreciosByProducto,
    getHistoryByProducto,
    addPrecio
};
