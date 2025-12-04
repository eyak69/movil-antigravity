const express = require('express');
const router = express.Router();
const monedaController = require('../controllers/monedaController');

router.get('/', monedaController.getAllMonedas);
router.post('/', monedaController.createMoneda);
router.put('/:id', monedaController.updateMoneda);
router.delete('/:id', monedaController.deleteMoneda);
router.post('/seed', monedaController.seedMonedas);

module.exports = router;
