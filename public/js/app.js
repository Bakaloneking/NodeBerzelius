document.querySelectorAll('td.new').forEach(td => {
    const horario = td.dataset.horario || td.innerText.trim(); // Fallback para conteúdo
    td.style.position = 'relative';

    const btn = document.createElement('button');
    btn.className = 'addBtn';
    btn.title = 'Marcar aula';
    btn.textContent = '+';

    // Adiciona o evento de clique ao botão
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o evento de clique no td seja acionado
        e.preventDefault();

        // Redireciona para a página de marcação, passando o horário na URL
        const url = `marcacao.html?horario=${encodeURIComponent(horario)}`; //window.location.href = 'http://localhost:6969/cadAulas';
        window.location.href = 'http://localhost:6969/aulas/nova';
    });

    td.appendChild(btn);
});

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