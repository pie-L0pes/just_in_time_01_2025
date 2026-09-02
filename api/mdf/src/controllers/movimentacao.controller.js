const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydbpreparacao_db'
});

const prisma = new PrismaClient({ adapter });

const cadastrar = async (req, res) => {
    try {
        const { produtoId, usuarioId, tipo, quantidade, data } = req.body;

        const produto = await prisma.produto.findUnique({
            where: {
                id: produtoId
            }
        });

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado'
            });
        }

        if (tipo === 'SAIDA' && produto.estoque < quantidade) {
            return res.status(400).json({
                erro: 'Estoque insuficiente'
            });
        }

        const movimentacao = await prisma.$transaction(async (tx) => {
            const novaMovimentacao = await tx.movimentacao.create({
                data: {
                    produtoId,
                    usuarioId,
                    tipo,
                    quantidade,
                    data: data ? new Date(data) : new Date()
                }
            });

            await tx.produto.update({
                where: {
                    id: produtoId
                },
                data: {
                    estoque: tipo === 'ENTRADA'
                        ? { increment: quantidade }
                        : { decrement: quantidade }
                }
            });

            return novaMovimentacao;
        });

        const novoEstoque = tipo === 'ENTRADA'
            ? produto.estoque + quantidade
            : produto.estoque - quantidade;

        res.status(201).json({
            mensagem: 'Movimentação registrada com sucesso',
            movimentacao,
            estoque: novoEstoque,
            estoqueBaixo: tipo === 'SAIDA' && novoEstoque < produto.estoqueMinimo
        });

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao registrar movimentação'
        });
    }
};

module.exports = {
    cadastrar
};

