const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydbpreparacao_db'
});

const prisma = new PrismaClient({ adapter });

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        console.log('Email recebido:', email);
        console.log('Senha recebida:', senha);

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });
        console.log('Usuário encontrado:', usuario);

        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({
                erro: 'Email ou senha incorretos'
            });
        }

        res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao realizar login'
        });
    }
};

module.exports = {
    login
};