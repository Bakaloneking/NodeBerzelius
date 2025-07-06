document.addEventListener("DOMContentLoaded", () => {
    const btnAulas = document.getElementById("btnAulas");
    const btnRelatorios = document.getElementById("btnRelatorios");
  
    btnAulas?.addEventListener("click", () => {
      window.location.href = "aulas-professor.html";
    });
  
    btnRelatorios?.addEventListener("click", () => {
      window.location.href = "relatorios-professor.html";
    });
  });