const API = 'http://localhost:3000/produto';

const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'login.html';
}

document.getElementById('nomeUsuario').textContent = usuario.nome;

const listaProdutos = document.getElementById('listaProdutos');
const pesquisa = document.getElementById('pesquisa');
const modal = document.getElementById('modal');
const formProduto = document.getElementById('formProduto');
const mensagem = document.getElementById('mensagem');

let produtos = [];

async function listarProdutos() {
    try {
        const resposta = await fetch(`${API}/listar`);
        produtos = await resposta.json();

        mostrarProdutos(produtos);
    } catch (error) {
        mensagem.textContent = 'Erro ao carregar produtos.';
    }
}

function mostrarProdutos(lista) {
    listaProdutos.innerHTML = '';

    if (lista.length === 0) {
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6">Nenhum produto encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach(produto => {
        listaProdutos.innerHTML += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.descricao}</td>
                <td>R$ ${Number(produto.custo).toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.estoqueMinimo}</td>
                <td>
                    <button class="editar" onclick="editarProduto(${produto.id})">
                        Editar
                    </button>

                    <button class="excluir" onclick="excluirProduto(${produto.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

pesquisa.addEventListener('input', () => {
    const texto = pesquisa.value.toLowerCase();

    const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    );

    mostrarProdutos(filtrados);
});

document.getElementById('btnNovo').addEventListener('click', () => {
    formProduto.reset();
    document.getElementById('produtoId').value = '';
    document.getElementById('tituloModal').textContent = 'Novo produto';
    modal.style.display = 'flex';
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    modal.style.display = 'none';
});

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('produtoId').value;

    const produto = {
        nome: document.getElementById('nome').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        custo: Number(document.getElementById('custo').value),
        estoque: Number(document.getElementById('estoque').value),
        estoqueMinimo: Number(document.getElementById('estoqueMinimo').value)
    };

    if (produto.custo < 0 || produto.estoque < 0 || produto.estoqueMinimo < 0) {
        alert('Os valores não podem ser negativos.');
        return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id
        ? `${API}/atualizar/${id}`
        : `${API}/cadastrar`;

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao salvar produto.');
            return;
        }

        modal.style.display = 'none';
        await listarProdutos();

    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
});

async function editarProduto(id) {
    try {
        const resposta = await fetch(`${API}/buscar/${id}`);
        const produto = await resposta.json();

        document.getElementById('produtoId').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('custo').value = produto.custo;
        document.getElementById('estoque').value = produto.estoque;
        document.getElementById('estoqueMinimo').value = produto.estoqueMinimo;

        document.getElementById('tituloModal').textContent = 'Editar produto';
        modal.style.display = 'flex';

    } catch (error) {
        alert('Erro ao buscar produto.');
    }
}

async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/excluir/${id}`, {
            method: 'DELETE'
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao excluir produto.');
            return;
        }

        await listarProdutos();

    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
}

document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

listarProdutos();