document.addEventListener("DOMContentLoaded", function () {
    const frascos = document.querySelectorAll('.bottle');

    frascos.forEach(frasco => {
        frasco.addEventListener('mouseenter', () => {
            frasco.style.transform = 'scale(1.2)';
        });

        frasco.addEventListener('mouseleave', () => {
            frasco.style.transform = 'scale(1)';
        });

        frasco.addEventListener('click', () => {
            const nome = frasco.getAttribute('data-nome');
            const quantidade = frasco.getAttribute('data-quantidade');
            alert(`Detalhes do item:\nNome: ${nome}\nQuantidade: ${quantidade}`);
        });
    });
});
