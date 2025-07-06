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
        window.location.href = 'http://localhost:6969/cadAulas';
    });

    td.appendChild(btn);
});

/*function adicionarDataHorario() {
    // Pega o cabeçalho da tabela onde tem as datas (supondo que seja o primeiro <tr>)
    const tabela = document.querySelector('#calendario table');
    const linhas = tabela.querySelectorAll('tr');
    
    // Pega as datas da primeira linha, ignorando a primeira célula que pode ser "Horário"
    const datas = [];
    linhas[0].querySelectorAll('th').forEach((th, i) => {
        if(i > 0) { // ignora a primeira coluna que pode ser o label do horário
            // Suponha que a data está em formato "dd/mm"
            datas.push(th.textContent.trim());
        }
    });
    
    // Agora para cada linha, menos a primeira (que é cabeçalho)
    for(let i = 1; i < linhas.length; i++) {
        const linha = linhas[i];
        const celulas = linha.querySelectorAll('td, th');
        
        // Pegue o horário da primeira célula (linha lateral)
        const horario = celulas[0].textContent.trim(); // Ex: "08:00"
        
        // Percorra as outras células da linha
        for(let j = 1; j < celulas.length; j++) {
            const td = celulas[j];
            
            // Só adicionar em células "novas" (vazias)
            if(td.classList.contains('new')) {
                // Combine a data da coluna + horário da linha para criar o datetime
                // Aqui assumimos ano fixo e formato brasileiro dd/mm, converter para yyyy-mm-ddThh:mm
                const dataTexto = datas[j-1]; // data do cabeçalho
                // Convertendo "dd/mm" para "yyyy-mm-dd"
                const partes = dataTexto.split('/');
                const ano = new Date().getFullYear(); // ano atual
                const dataISO = `${ano}-${partes[1].padStart(2,'0')}-${partes[0].padStart(2,'0')}`;
                const dataHorario = `${dataISO}T${horario}`;
                
                // Adiciona o atributo
                td.setAttribute('data-horario', dataHorario);
            }
        }
    }
}

// Chama essa função quando carregar a página
window.onload = () => {
    adicionarDataHorario();
};*/
