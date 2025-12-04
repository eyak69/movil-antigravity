const Producto = require('../models/Producto');

exports.crearProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const producto = await Producto.create({ nombre, precio });
        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;
        await producto.save();
        res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await producto.destroy();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
