document.addEventListener("DOMContentLoaded", function () {
    console.log("Página carregada. Atualizando encomendas...");
    atualizarEncomendas(); // Chama a função para exibir as encomendas ao carregar a página
});

/**
 * Função para atualizar a lista de encomendas na interface
 */
function atualizarEncomendas() {
    console.log("Atualizando lista de encomendas...");
    const encomendasList = document.getElementById("encomendas-list");
    let encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

    // Filtra encomendas que ainda não expiraram
    encomendas = encomendas.filter(encomenda => encomenda.estado !== "Expirado");

    // Ordena as encomendas por data de criação (createdAt)
    encomendas.sort((a, b) => a.createdAt - b.createdAt);

    // Limpa a lista antes de renderizar
    encomendasList.innerHTML = "";

    if (encomendas.length === 0) {
        encomendasList.innerHTML = "<p>Você não tem nenhuma encomenda no momento.</p>";
    } else {
        encomendas.forEach((encomenda) => {
            const encomendaDiv = document.createElement("div");
            encomendaDiv.className = "encomenda-item";

            encomendaDiv.innerHTML = `
                <p><strong>Encomenda #${encomenda.codigo}</strong></p>
                <p>
                    <span style="color: hsl(210, 17%, 25%)">Data:</span> 
                    <span style="font-weight: 500">${encomenda.dataExtenso || "Não disponível"}</span> | 
                    <span style="color: hsl(210, 17%, 25%)">Estado: </span>
                    <span style="font-weight: 500">${encomenda.estado || "Desconhecido"}</span>
                </p>
                <p id="${encomenda.codigo}-timer" class="countdown-timer"></p>
            `;
            encomendasList.appendChild(encomendaDiv);

            if (typeof generateCountdownTimer === "function") {
                console.log(`Gerando timer para Encomenda #${encomenda.codigo}`);
                generateCountdownTimer(encomenda);
            }
        });
    }

    // Atualiza o localStorage com apenas as encomendas não expiradas
    localStorage.setItem("encomendas", JSON.stringify(encomendas));
}

/**
 * Função para gerar o timer da encomenda
 */
function generateCountdownTimer(encomenda) {
    const timerElement = document.getElementById(`${encomenda.codigo}-timer`);
    const agora = Date.now();

    // Carregar o tempo salvo ou criar um novo
    const savedEndTime = localStorage.getItem(`timer_${encomenda.codigo}`);
    const endTime = savedEndTime ? parseInt(savedEndTime, 10) : agora + 3600000; // Exemplo: 1 hora restante

    // Salva o tempo final, caso ainda não tenha sido salvo
    if (!savedEndTime) {
        localStorage.setItem(`timer_${encomenda.codigo}`, endTime);
    }

    function atualizarTimer() {
        const tempoRestante = endTime - Date.now();

        if (tempoRestante <= 0) {
            timerElement.textContent = "Tempo esgotado!";
            clearInterval(interval);
            localStorage.removeItem(`timer_${encomenda.codigo}`);

            // Muda o estado da encomenda para "Expirado"
            encomenda.estado = "Expirado";

            // Move a encomenda para o histórico
            const historico = JSON.parse(localStorage.getItem("historicoEncomendas")) || [];
            historico.push(encomenda);
            localStorage.setItem("historicoEncomendas", JSON.stringify(historico));

            // Remove a encomenda da lista ativa
            let encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];
            encomendas = encomendas.filter(e => e.codigo !== encomenda.codigo);
            localStorage.setItem("encomendas", JSON.stringify(encomendas));

            // Atualiza a interface para remover a encomenda expirada
            atualizarEncomendas();
        } else {
            const horas = Math.floor((tempoRestante / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
            const segundos = Math.floor((tempoRestante / 1000) % 60);
            timerElement.textContent = `${horas}h ${minutos}m ${segundos}s`;
        }
    }

    atualizarTimer(); // Atualiza o timer imediatamente
    const interval = setInterval(atualizarTimer, 1000);
}
