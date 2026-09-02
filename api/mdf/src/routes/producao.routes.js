const express = require('express');
const router = express.Router();

const producaoController = require('../controllers/producao.controller');

router.post('/cadastrar', producaoController.cadastrar);

module.exports = router;