window.addEventListener('DOMContentLoaded', () => {
    // Atualiza o título com a data atual
    const tituloData = document.querySelector('#data .date');
    if (tituloData) {
      const hoje = new Date();
      const dia  = String(hoje.getDate()).padStart(2, '0');
      const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano  = hoje.getFullYear();
      tituloData.textContent = `Data Atual: ${dia}/${mes}/${ano}`;
    }
  
    // Atualiza os cabeçalhos da tabela com dias da semana e datas
    const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    const hoje = new Date();
    const diaAtual = hoje.getDay(); // 0 (domingo) a 6 (sábado)
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaAtual);
  
    const ths = document.querySelectorAll("th");
  
    diasSemana.forEach((dia, i) => {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + i);
  
      const diaStr = String(data.getDate()).padStart(2, '0');
      const mesStr = String(data.getMonth() + 1).padStart(2, '0');
  
      ths.forEach(th => {
        if (th.textContent.trim().startsWith(dia)) {
          th.innerHTML = `<strong>${dia}</strong><br>${diaStr}/${mesStr}`;
        }
      });
    });
  });
  
  

