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
    const encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

    // Ordena as encomendas por data de criação (createdAt)
    encomendas.sort((a, b) => a.createdAt - b.createdAt);

    // Limpa a lista antes de renderizar
    encomendasList.innerHTML = "";

    const now = Date.now();
    const activeEncomendas = encomendas.filter(encomenda => encomenda.createdAt + 3600000 > now); // 1 hour in milliseconds
    const expiredEncomendas = encomendas.filter(encomenda => encomenda.createdAt + 3600000 <= now);

    // Atualiza o localStorage com as encomendas ativas
    localStorage.setItem("encomendas", JSON.stringify(activeEncomendas));
    // Atualiza o localStorage com as encomendas expiradas
    localStorage.setItem("historico", JSON.stringify(expiredEncomendas));

    if (activeEncomendas.length === 0) {
        encomendasList.innerHTML = "<p>Você não tem nenhuma encomenda no momento.</p>";
    } else {
        activeEncomendas.forEach((encomenda) => {
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
                <p style="margin-bottom:0">
                    <span style="color: hsl(210, 17%, 25%)">Detalhes:</span><br />
                    <ul class="mb-4">
                        <li style="font-size:0.925rem; font-weight: 500">
                            ${encomenda.detalhes || "Nenhum detalhe fornecido."}
                        </li>
                    </ul>
                </p>
                <p id="${encomenda.codigo}-timer" class="countdown-timer"></p>
                <p style="margin-bottom:0.25rem">
                    <span style="font-size: 0.95rem">
                        <span style="color: hsl(210, 17%, 25%)">Localização do cacifo:</span> 
                        <span style="font-weight: 500">${encomenda.cacifo || "Não especificado."}</span>
                    </span><br />
                    <button 
                        class="mt-3 btn btn-warning ms-2" 
                        onclick="alterarLocalizacao('${encomenda.codigo}')">
                        Alterar Localização
                    </button>
                    <button 
                        class="mt-3 btn btn-info ms-2" 
                        onclick="verEstado('${encomenda.estado}')">
                        Ver Estado
                    </button>
                </p>
            `;
            encomendasList.appendChild(encomendaDiv);

            if (typeof generateCountdownTimer === "function") {
                console.log(`Gerando timer para Encomenda #${encomenda.codigo}`);
                generateCountdownTimer(encomenda);
            }
        });
    }
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

/**
 * Função para visualizar o estado de uma encomenda
 */
function verEstado(estado) {
    console.log(`Visualizando estado: ${estado}`);
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));

    if (estado === "Envio") {
        document.getElementById("step-envio").classList.add("active");
    } else if (estado === "Em Transporte") {
        document.getElementById("step-envio").classList.add("active");
        document.getElementById("step-transporte").classList.add("active");
    } else if (estado === "Entregue") {
        document.getElementById("step-envio").classList.add("active");
        document.getElementById("step-transporte").classList.add("active");
        document.getElementById("step-entregue").classList.add("active");
    }

    const estadoModal = new bootstrap.Modal(document.getElementById("estadoModal"));
    estadoModal.show();
}

/**
 * Função para alterar a localização de uma encomenda
 */
function alterarLocalizacao(codigoEncomenda) {
    console.log(`Alterando localização para Encomenda #${codigoEncomenda}...`);

    const baseUrl = `${window.location.origin}`;
    const url = `${baseUrl}/alterarcacifo.html?codigoEncomenda=${codigoEncomenda}`;
    window.location.href = url;

    setTimeout(() => {
        console.log("Buscando dados atualizados após alteração...");

        fetch(`http://localhost:5292/api/obterEncomendas`)
            .then(response => response.json())
            .then(updatedEncomendas => {
                // Obter as encomendas atuais do localStorage
                let encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

                // Verificar se a encomenda já existe
                const encomendaIndex = encomendas.findIndex(encomenda => encomenda.codigo === codigoEncomenda);

                if (encomendaIndex !== -1) {
                    // Atualizar a encomenda existente
                    encomendas[encomendaIndex].cacifo = updatedEncomendas[0]?.cacifo || encomendas[encomendaIndex].cacifo;
                    encomendas[encomendaIndex].tamanho = updatedEncomendas[0]?.tamanho || encomendas[encomendaIndex].tamanho;
                    encomendas[encomendaIndex].createdAt = new Date().getTime(); // Reset timer
                    console.log(`Encomenda #${codigoEncomenda} atualizada.`);
                } else {
                    // Adicionar a nova encomenda apenas se não existir
                    console.log(`Encomenda #${codigoEncomenda} não encontrada. Criando nova.`);
                    encomendas.push({
                        codigo: codigoEncomenda,
                        cacifo: updatedEncomendas[0]?.cacifo || "Não especificado.",
                        tamanho: updatedEncomendas[0]?.tamanho || "Não especificado.",
                        estado: updatedEncomendas[0]?.estado || "Desconhecido",
                        dataExtenso: updatedEncomendas[0]?.dataExtenso || "Data não disponível",
                        detalhes: updatedEncomendas[0]?.detalhes || "Sem detalhes",
                        createdAt: new Date().getTime() // Reset timer
                    });
                }

                // Salvar no localStorage
                localStorage.setItem("encomendas", JSON.stringify(encomendas));

                // Atualiza a interface
                atualizarEncomendas();
            })
            .catch(error => console.error('Erro ao obter encomendas:', error));
    }, 1000); // Pequeno atraso para garantir o redirecionamento
}
