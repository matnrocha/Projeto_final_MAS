document.addEventListener("DOMContentLoaded", function () {
    atualizarEncomendas(); // Chama a função para exibir as encomendas ao carregar a página
});

/**
 * Função para atualizar a lista de encomendas na interface
 */
function atualizarEncomendas() {
    const encomendasList = document.getElementById("encomendas-list");
    const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || [];

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
                    <span style="font-weight: 500">${encomenda.dataExtenso}</span> | 
                    <span style="color: hsl(210, 17%, 25%)">Estado: </span>
                    <span style="font-weight: 500">${encomenda.estado}</span>
                </p>
                <p style="margin-bottom:0">
                    <span style="color: hsl(210, 17%, 25%)">Detalhes:</span><br />
                    <ul class="mb-4">
                        <li style="font-size:0.925rem; font-weight: 500">
                            ${encomenda.detalhes}
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

            // Gera o timer, se necessário
            if (typeof generateCountdownTimer === "function") {
                generateCountdownTimer(encomenda);
            }
        });
    }
}

/**
 * Função para visualizar o estado de uma encomenda
 * @param {string} estado Estado da encomenda
 */
function verEstado(estado) {
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
 * @param {string} codigoEncomenda Código da encomenda a ser alterada
 */
function alterarLocalizacao(codigoEncomenda) {
    sessionStorage.setItem("alterarEncomenda", codigoEncomenda);
    window.location.href = "cacifo.html"; // Redireciona para a página de alteração
}
