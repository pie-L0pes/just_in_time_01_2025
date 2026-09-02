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
        const { cliente, usuarioId, itens, data } = req.body;

        const pedido = await prisma.$transaction(async (tx) => {
            for (const item of itens) {
                const produto = await tx.produto.findUnique({
                    where: {
                        id: item.produtoId
                    }
                });

                if (!produto) {
                    throw new Error('Produto não encontrado');
                }

                if (produto.estoque < item.quantidade) {
                    throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);
                }

                await tx.produto.update({
                    where: {
                        id: item.produtoId
                    },
                    data: {
                        estoque: {
                            decrement: item.quantidade
                        }
                    }
                });

                await tx.movimentacao.create({
                    data: {
                        produtoId: item.produtoId,
                        usuarioId: usuarioId,
                        tipo: 'SAIDA',
                        quantidade: item.quantidade,
                        data: data ? new Date(data) : new Date()
                    }
                });
            }

            return await tx.pedido.create({
                data: {
                    cliente,
                    data: data ? new Date(data) : new Date(),
                    itens: {
                        create: itens.map(item => ({
                            produtoId: item.produtoId,
                            quantidade: item.quantidade
                        }))
                    }
                },
                include: {
                    itens: true
                }
            });
        });

        const estoqueBaixo = [];

        for (const item of itens) {
            const produto = await prisma.produto.findUnique({
                where: {
                    id: item.produtoId
                }
            });

            if (produto.estoque < produto.estoqueMinimo) {
                estoqueBaixo.push(produto.nome);
            }
        }

        res.status(201).json({
            mensagem: estoqueBaixo.length > 0
                ? 'Pedido registrado. Estoque abaixo do mínimo.'
                : 'Pedido registrado com sucesso',
            pedido,
            estoqueBaixo
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            erro: error.message
        });
    }
};

module.exports = {
    cadastrar
};