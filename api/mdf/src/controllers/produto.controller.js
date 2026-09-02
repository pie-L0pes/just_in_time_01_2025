const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.produto.create({
        data
    });

    res.json(item).status(201).end();
};

const listar = async (req, res) => {
    const lista = await prisma.produto.findMany();

    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.produto.findUnique({
        where: { id : Number(id) }
    });

    res.json(item).status(200).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    
    const item = await prisma.produto.update({
        where: { id : Number(id) },
        data: dados
    });

    res.json(item).status(200).end();
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await prisma.produto.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                itens: true,
                producoes: true,
                movimentacoes: true
            }
        });

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado'
            });
        }

        if (
            produto.itens.length > 0 ||
            produto.producoes.length > 0 ||
            produto.movimentacoes.length > 0
        ) {
            return res.status(400).json({
                erro: 'Não é possível excluir este produto porque ele possui registros relacionados.'
            });
        }

        await prisma.produto.delete({
            where: {
                id: Number(id)
            }
        });

        res.status(200).json({
            mensagem: 'Produto excluído com sucesso'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir produto'
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
