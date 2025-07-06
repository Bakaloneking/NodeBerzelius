document.addEventListener('DOMContentLoaded', () => {
    const selectLab = document.getElementById('cLab');
    const todasAsCelulasMarcadas = document.querySelectorAll('td.marcada');

    function filtrarCalendario(filtroLabId) {
        todasAsCelulasMarcadas.forEach(celula => {
            const labIdDaAula = celula.getAttribute('data-lab-id');

            // Se o filtro for "todos" OU se o lab da aula for igual ao filtro, mostra a célula.
            if (filtroLabId === 'todos' || labIdDaAula == filtroLabId) {
                celula.style.visibility = 'visible';
            } else {
                // Senão, esconde a célula.
                celula.style.visibility = 'hidden';
            }
        });
    }

    // Adiciona o "escutador de eventos" ao menu de seleção
    selectLab.addEventListener('change', (event) => {
        const laboratorioSelecionadoId = event.target.value;
        filtrarCalendario(laboratorioSelecionadoId);
    });

    // Garante que, ao carregar a página, todos os agendamentos estejam visíveis
    filtrarCalendario('todos');
});