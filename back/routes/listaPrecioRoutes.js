const express = require('express');
const router = express.Router();
const listaPrecioController = require('../controllers/listaPrecioController');

router.get('/', listaPrecioController.getAllCurrentPrecios);
router.get('/producto/:id', listaPrecioController.getCurrentPreciosByProducto);
router.get('/producto/:id/history', listaPrecioController.getHistoryByProducto);
router.post('/', listaPrecioController.addPrecio);

module.exports = router;
