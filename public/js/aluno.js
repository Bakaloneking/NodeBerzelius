document.addEventListener("DOMContentLoaded", () => {
    const btnAulas = document.getElementById("btnAulas");
    const btnRelatorios = document.getElementById("btnRelatorios");
  
    btnAulas?.addEventListener("click", () => {
      window.location.href = "../aula.html";
    });
  
    btnRelatorios?.addEventListener("click", () => {
      window.location.href = "../relatorios.html";
    });
  });
  
  