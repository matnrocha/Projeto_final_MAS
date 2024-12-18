$(document).ready(function () {
    // Alternar visibilidade da senha
    $('#togglePassword').on('click', function () {
        const passwordField = $('#password');
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    });

    // Validação do formulário de login
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        let valid = true;

        // Validação de email
        if (!email || !email.includes('@')) {
            $('#email').addClass('is-invalid');
            valid = false;
        } else {
            $('#email').removeClass('is-invalid');
        }

        // Validação de senha
        if (!password) {
            $('#password').addClass('is-invalid');
            valid = false;
        } else {
            $('#password').removeClass('is-invalid');
        }

        if (valid) {
            // Recuperar o dicionário de usuários do localStorage
            const users = JSON.parse(localStorage.getItem('users')) || {};

            // Verificar se o usuário existe e a senha está correta
            if (users[email] && users[email] === password) {
                alert('Login bem-sucedido!');
                // Redirecionar para a página inicial
                window.location.href = "index.html";
            } else {
                alert('Email ou senha inválidos.');
            }
        }
    });
});
