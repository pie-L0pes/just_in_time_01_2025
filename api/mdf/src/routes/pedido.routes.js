const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedido.controller');

router.post('/cadastrar', pedidoController.cadastrar);

module.exports = router;