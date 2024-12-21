function generateCountdownTimer(encomenda) {
    const countdownContainer = document.getElementById(`${encomenda.codigo}-timer`);
    if (!countdownContainer) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = encomenda.createdAt + 5 * 60 * 1000 - now; // 5 minutes in milliseconds

        if (distance < 0) {
            countdownContainer.innerHTML = "00:00:00";
            countdownContainer.style.color = "red";
            encomenda.estado = "Expirado"; // Change estado to Expirado
            clearInterval(interval);

            // Move the expired encomenda to the history list
            let encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];
            let historico = JSON.parse(localStorage.getItem("historico")) || [];

            encomendas = encomendas.filter(e => e.codigo !== encomenda.codigo);
            if (!historico.some(e => e.codigo === encomenda.codigo)) {
                historico.push(encomenda);
            }

            localStorage.setItem("encomendas", JSON.stringify(encomendas));
            localStorage.setItem("historico", JSON.stringify(historico));

            // Update the UI
            atualizarEncomendas();
            atualizarHistorico();
            return;
        }
        
        const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((distance % (60 * 1000)) / 1000);

        countdownContainer.innerHTML = `${minutes}m ${seconds}s`;
        countdownContainer.style.color = "green";
    }, 1000);
}

function atualizarHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];
}
