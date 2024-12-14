$(document).ready(function() {
    // Alternar visibilidade da senha
    $('#togglePassword').on('click', function() {
        const passwordField = $('#password');
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    });

    // Validação do formulário
    $('#loginForm').on('submit', function(e) {
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
            // Armazenar os dados no Session Storage
            sessionStorage.setItem('email', email);

            // Redirecionar para a página inicial
            window.location.href = "index.html";
        }
    });
});