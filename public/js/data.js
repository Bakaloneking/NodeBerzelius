window.addEventListener('DOMContentLoaded', () => {
    // ---- Bloco 1: Atualização do Título (seu código original, mantido) ----
    const tituloData = document.querySelector('#data .date');
    if (tituloData) {
        const hoje = new Date();
        const dia  = String(hoje.getDate()).padStart(2, '0');
        const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano  = hoje.getFullYear();
        tituloData.textContent = `Data Atual: ${dia}/${mes}/${ano}`;
    }

    // ---- Bloco 2: Lógica de Datas e Atualização da Tabela (seu código otimizado) ----
    const hoje = new Date(); // Declaramos 'hoje' uma vez aqui para ser reutilizado
    const diaAtual = hoje.getDay(); // 0 (domingo) a 6 (sábado)

    // Calcula o início da semana (domingo)
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaAtual);

    // Atualiza os cabeçalhos da tabela (seu código original, mantido)
    const ths = document.querySelectorAll("th");
    const diasSemanaAbrev = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    diasSemanaAbrev.forEach((diaAbrev, i) => {
        const data = new Date(inicioSemana);
        data.setDate(inicioSemana.getDate() + i);
        const diaStr = String(data.getDate()).padStart(2, '0');
        const mesStr = String(data.getMonth() + 1).padStart(2, '0');

        ths.forEach(th => {
            if (th.textContent.trim().startsWith(diaAbrev)) {
                th.innerHTML = `<strong>${diaAbrev}</strong><br>${diaStr}/${mesStr}`;
            }
        });
    });

    // ===================================================================
    //      NOVO BLOCO: POPULAR O SELECT DE DATAS
    // ===================================================================

    // Pega a referência ao <select> de data pelo ID
    const selectData = document.getElementById('cData');

    // Limpa quaisquer opções que possam existir previamente no HTML
    selectData.innerHTML = '';

    // Loop de 7 dias (domingo a sábado) para criar as opções
    for (let i = 0; i < 7; i++) {
        const dataOpcao = new Date(inicioSemana);
        dataOpcao.setDate(inicioSemana.getDate() + i);

        // Formata a data no formato DD/MM/AA
        const dia = String(dataOpcao.getDate()).padStart(2, '0');
        const mes = String(dataOpcao.getMonth() + 1).padStart(2, '0');
        const ano = dataOpcao.getFullYear().toString().slice(-2); // Pega os 2 últimos dígitos do ano
        const valorOpcao = `${dia}/${mes}/${ano}`;

        // Formata o nome do dia da semana em português (ex: "Segunda-feira")
        // Intl.DateTimeFormat é a forma moderna e correta de lidar com nomes de datas
        const nomeDiaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(dataOpcao);
        const textoOpcao = `${nomeDiaSemana.charAt(0).toUpperCase() + nomeDiaSemana.slice(1)} - ${valorOpcao}`;

        // Cria o elemento <option>
        const optionElement = document.createElement('option');
        optionElement.value = valorOpcao;
        optionElement.textContent = textoOpcao;

        // Adiciona a nova <option> ao <select>
        selectData.appendChild(optionElement);
    }
});