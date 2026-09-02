const express = require('express');
const router = express.Router();

const movimentacaoController = require('../controllers/movimentacao.controller');

router.post('/cadastrar', movimentacaoController.cadastrar);

module.exports = router;
