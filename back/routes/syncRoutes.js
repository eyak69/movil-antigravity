const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

router.post('/', syncController.syncPersonas);

module.exports = router;
