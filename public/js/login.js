document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Impede o envio do formulário
  
      const username = document.getElementById("username").value.trim();
  
      switch (username) {
        case "tecn":
          window.location.href = "tecnico.html"; // redireciona para a área do técnico
          break;
        case "prof":
          window.location.href = "professor.html"; // redireciona para a área do professor
          break;
        case "alun":
          window.location.href = "aluno.html"; // redireciona para a área do aluno
          break;
        default:
          alert("Usuário inválido. Use:\n1 - Técnico\n2 - Professor\n3 - Aluno");
          break;
      }
    });
  });
  
  