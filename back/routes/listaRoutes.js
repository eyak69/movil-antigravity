const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaController');

router.get('/', listaController.getAllListas);
router.post('/', listaController.createLista);
router.put('/:id', listaController.updateLista);
router.delete('/:id', listaController.deleteLista);
router.post('/seed', listaController.seedListas);

module.exports = router;
