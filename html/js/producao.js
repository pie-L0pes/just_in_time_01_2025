const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'login.html';
}

document.getElementById('nomeUsuario').textContent = usuario.nome;

const produtoSelect = document.getElementById('produto');
const tipoSelect = document.getElementById('tipo');
const quantidadeInput = document.getElementById('quantidade');
const dataInput = document.getElementById('data');
const mensagem = document.getElementById('mensagem');

const API_PRODUTO = 'http://localhost:3000/produto';
const API_PRODUCAO = 'http://localhost:3000/producao';
const API_PEDIDO = 'http://localhost:3000/pedido';

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API_PRODUTO}/listar`);
        const produtos = await resposta.json();

        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        produtos.forEach(produto => {
            produtoSelect.innerHTML += `
                <option value="${produto.id}">
                    ${produto.nome}
                </option>
            `;
        });

    } catch (error) {
        mensagem.textContent = 'Erro ao carregar produtos.';
    }
}

document.getElementById('btnRegistrar').addEventListener('click', async () => {
    const produtoId = Number(produtoSelect.value);
    const tipo = tipoSelect.value;
    const quantidade = Number(quantidadeInput.value);
    const data = dataInput.value;

    if (!produtoId || !tipo || !quantidade || quantidade < 1 || !data) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    try {
        if (tipo === 'fabricado') {
            await registrarFabricacao(produtoId, quantidade, data);
        } else {
            await registrarPedido(produtoId, quantidade, data);
        }
    } catch (error) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
    }
});

async function registrarFabricacao(produtoId, quantidade, data) {
    const resposta = await fetch(`${API_PRODUCAO}/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            produtoId,
            usuarioId: usuario.id,
            quantidade,
            data
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || 'Erro ao registrar fabricação.');
        return;
    }

    mensagem.textContent = 'Produto fabricado registrado com sucesso!';
    limparFormulario();
}

async function registrarPedido(produtoId, quantidade, data) {
    const resposta = await fetch(`${API_PEDIDO}/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cliente: 'Cliente',
            usuarioId: usuario.id,
            itens: [
                {
                    produtoId,
                    quantidade
                }
            ],
            data
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || 'Erro ao registrar pedido.');
        return;
    }

    if (dados.estoqueBaixo && dados.estoqueBaixo.length > 0) {
        alert('Atenção: o estoque deste produto está abaixo do estoque mínimo!');
    }

    mensagem.textContent = 'Pedido registrado com sucesso!';
    limparFormulario();
}

function limparFormulario() {
    produtoSelect.value = '';
    tipoSelect.value = '';
    quantidadeInput.value = '';
    dataInput.value = '';
}

document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

carregarProdutos();