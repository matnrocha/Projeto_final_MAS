$(document).ready(function () {
    // Alternar visibilidade da senha
    $('#togglePassword').on('click', function () {
        const passwordField = $('#password');
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    });

    // Validação do formulário de registro
    $('#registerForm').on('submit', function (e) {
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

            // Verificar se o email já está registrado
            if (users[email]) {
                alert('Esse email já está registrado.');
            } else {
                // Adicionar o novo usuário ao dicionário
                users[email] = password;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Usuário registrado com sucesso!');

                // Redirecionar para a página de login
                window.location.href = "login.html";
            }
        }
    });
});
