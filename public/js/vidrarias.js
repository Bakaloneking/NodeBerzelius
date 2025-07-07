// Arquivo: public/js/vidrarias.js

document.addEventListener('DOMContentLoaded', () => {
    const galeriaContainer = document.querySelector('.shelf');
    const detalhesContainer = document.getElementById('detalhes-vidraria-container');

    if (!galeriaContainer) return;

    galeriaContainer.addEventListener('click', async (event) => {
        const linkVidraria = event.target.closest('a.vidraria-link');
        if (!linkVidraria) return;

        event.preventDefault();

        const vidrariaId = linkVidraria.getAttribute('data-id');
        if (!vidrariaId) return;

        detalhesContainer.innerHTML = '<p>Carregando...</p>';
        detalhesContainer.style.display = 'block';

        try {
            const response = await fetch(`/api/vidrarias/${vidrariaId}`);
            if (!response.ok) throw new Error('Vidraria não encontrada.');

            const vidraria = await response.json();

            const detalhesHtml = `
                <div class="detalhe-item-card">
                    <div class="detalhe-imagem">
                        <img src="${vidraria.vid_imagem_path}" alt="${vidraria.vid_nome}">
                    </div>
                    <div class="detalhe-texto">
                        <h2>${vidraria.vid_nome}</h2>
                        <p>${vidraria.vid_descricao || 'Nenhuma descrição disponível.'}</p>
                    </div>
                </div>
            `;

            detalhesContainer.innerHTML = detalhesHtml;

        } catch (error) {
            detalhesContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    });
});