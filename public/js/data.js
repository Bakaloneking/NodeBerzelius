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

    if (selectData) {
        selectData.innerHTML = ''; // Limpa opções antigas

        // Cria a opção placeholder
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Selecione uma data válida";
        placeholder.disabled = true;
        placeholder.selected = true;
        selectData.appendChild(placeholder);

        const hoje = new Date();
        const dataMinima = new Date();
        dataMinima.setDate(hoje.getDate() + 2); // Data mínima: hoje + 2 dias

        const dataMaxima = new Date();
        dataMaxima.setDate(hoje.getDate() + 30); // Data máxima: hoje + 30 dias

        // Loop de hoje+2 até hoje+30
        for (let d = dataMinima; d <= dataMaxima; d.setDate(d.getDate() + 1)) {
            const dataOpcao = new Date(d); // Cria uma cópia para não alterar o 'd' do loop

            const dia = String(dataOpcao.getDate()).padStart(2, '0');
            const mes = String(dataOpcao.getMonth() + 1).padStart(2, '0');
            const ano = dataOpcao.getFullYear(); // Usar ano com 4 dígitos é mais seguro

            const valorOpcao = `${ano}-${mes}-${dia}`; // Formato AAAA-MM-DD para o back-end

            const nomeDiaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(dataOpcao);
            const textoOpcao = `${nomeDiaSemana.charAt(0).toUpperCase() + nomeDiaSemana.slice(1)} - ${dia}/${mes}/${ano}`;

            const optionElement = document.createElement('option');
            optionElement.value = valorOpcao;
            optionElement.textContent = textoOpcao;

            selectData.appendChild(optionElement);
        }
    }
});