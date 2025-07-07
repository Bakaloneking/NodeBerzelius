document.addEventListener('DOMContentLoaded', () => {
    const tabelaContainer = document.querySelector('.tabelaCompleta');
    const detalhesContainer = document.getElementById('elemento-detalhes-container');

    const classMapJSON = tabelaContainer.getAttribute('data-classmap');
    const classMap = JSON.parse(classMapJSON);

    tabelaContainer.addEventListener('click', async (event) => {
        const linkElemento = event.target.closest('a.lEle');
        if (!linkElemento) return;

        event.preventDefault();

        const elementoId = linkElemento.parentElement.getAttribute('data-id');
        if (!elementoId) return;

        detalhesContainer.innerHTML = '<p>Carregando dados...</p>';

        try {
            const response = await fetch(`/api/elementos/${elementoId}`);
            if (!response.ok) {
                throw new Error('Elemento não encontrado ou erro no servidor.');
            }
            const elemento = await response.json();

            const cssClass = elemento.serie ? classMap[elemento.serie.serid] : 'desconhecidos';

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