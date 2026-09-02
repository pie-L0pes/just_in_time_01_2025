const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'login.html';
} else {
    document.getElementById('nomeUsuario').textContent = usuario.nome;
}

document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});