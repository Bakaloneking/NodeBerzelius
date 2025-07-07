// Arquivo: public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, senha: senha })
                });

                const data = await response.json();

                if (response.ok) { // Status 2xx (sucesso)
                    // Se o servidor retornar uma URL de redirecionamento, use-a
                    window.location.href = data.redirectUrl;
                } else {
                    // Se o servidor retornar um erro (4xx ou 5xx)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message || 'Ocorreu um erro. Tente novamente.'
                    });
                }
            } catch (error) {
                console.error('Erro de rede ou ao enviar o formulário:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de Conexão',
                    text: 'Não foi possível se comunicar com o servidor.'
                });
            }
        });
    }
});