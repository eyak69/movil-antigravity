const express = require('express');
const router = express.Router();
const devController = require('../controllers/devController');

router.delete('/personas', devController.nukePersonas);
router.delete('/productos', devController.nukeProductos);

module.exports = router;
