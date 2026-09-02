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
        const { produtoId, usuarioId, quantidade, data } = req.body;

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

        const producao = await prisma.$transaction(async (tx) => {
            const novaProducao = await tx.producao.create({
                data: {
                    produtoId,
                    usuarioId,
                    quantidade,
                    data: data ? new Date(data) : new Date()
                }
            });

            await tx.produto.update({
                where: {
                    id: produtoId
                },
                data: {
                    estoque: {
                        increment: quantidade
                    }
                }
            });

            await tx.movimentacao.create({
                data: {
                    produtoId,
                    usuarioId,
                    tipo: 'ENTRADA',
                    quantidade,
                    data: data ? new Date(data) : new Date()
                }
            });

            return novaProducao;
        });

        res.status(201).json(producao);

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao registrar produção'
        });
    }
};

module.exports = {
    cadastrar
};
