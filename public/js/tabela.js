// Arquivo: public/js/tabela.js

document.addEventListener('DOMContentLoaded', () => {
    const tabelaContainer = document.querySelector('.tabelaCompleta');
    const detalhesContainer = document.getElementById('elemento-detalhes-container');

    // Usamos 'event delegation' para ouvir cliques na tabela inteira
    tabelaContainer.addEventListener('click', async (event) => {
        // Encontra o link <a> mais próximo que foi clicado
        const linkElemento = event.target.closest('a.lEle');

        if (!linkElemento) return; // Se o clique não foi em um elemento, não faz nada

        event.preventDefault(); // Impede a navegação padrão do link

        const elementoId = linkElemento.parentElement.getAttribute('data-id');
        if (!elementoId) return;

        // Mostra um feedback de "carregando"
        detalhesContainer.innerHTML = '<p>Carregando dados...</p>';
        detalhesContainer.style.display = 'block'; // Torna o container visível

        try {
            // Chama a nossa nova rota da API
            const response = await fetch(`/api/elementos/${elementoId}`);

            if (!response.ok) {
                throw new Error('Elemento não encontrado ou erro no servidor.');
            }

            const elemento = await response.json();
            const cssClass = elemento.serie ? classMap[elemento.serie.serid] : 'desconhecidos';


            // Monta o HTML com os detalhes do elemento
            const detalhesHtml = `
        <div class="detalhe-elemento-card">
            <aside id="elemento-info-box">
                <section class="${cssClass}">
                    <strong>${elemento.eleid}</strong>
                    <div class="simboloQuimico">${elemento.elesimbolo}</div>
                    <em class="nomesMedios">${elemento.elenome}</em>
                </section>
            </aside>
            <article id="conteudo-detalhe">
                <h2>${elemento.elenome} (${elemento.elesimbolo})</h2>
                <p id="textoElemento">
                    <strong>Série Química:</strong> ${elemento.serie ? elemento.serie.serdescricao : 'Desconhecida'}<br>
                    <strong>Estado Físico (25°C):</strong> ${elemento.estadoFisico ? elemento.estadoFisico.estafisidescricao : 'Desconhecido'}<br>
                    <strong>Descrição:</strong> ${elemento.eledescricao || 'Nenhuma descrição disponível.'}
                </p>
            </article>
        </div>
    `;

            detalhesContainer.innerHTML = detalhesHtml;

        } catch (error) {
            console.error('Erro ao buscar detalhes do elemento:', error);
            detalhesContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    });
});