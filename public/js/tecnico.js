window.onload = function() {
    const botoes = document.querySelectorAll('#geren .itens');

    const destinos = [
        'aula.html',
        'usuarios.html',
        'vidrarias.html',
        'insumos.html',
        'residuos.html'
    ];

    botoes.forEach((botao, index) => {
        botao.style.cursor = 'pointer';
        botao.addEventListener('click', () => {
            window.location.href = destinos[index];
        });
    });
};
