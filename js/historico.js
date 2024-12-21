document.addEventListener("DOMContentLoaded", function () {
    atualizarHistorico(); // Chama a função para exibir o histórico ao carregar a página
});

/**
 * Função para atualizar o histórico de encomendas na interface
 */
function atualizarHistorico() {
    console.log("Atualizando histórico de encomendas...");
    const historicoList = document.getElementById("historico-list");
    
    // Mockup objects for historico array
    const historico = JSON.parse(localStorage.getItem("historico")) || [
        {
            codigo: "001",
            dataExtenso: "16 de Dezembro de 2024",
            estado: "Entregue",
            detalhes: "Tamanho: médio",
            cacifo: "Coimbra Centro"
        },
        {
            codigo: "002",
            dataExtenso: "21 de Dezembro de 2023",
            estado: "Entregue",
            detalhes: "Tamanho: pequeno",
            cacifo: "Porto Gaia"
        }
    ];

    // Limpa a lista antes de renderizar
    historicoList.innerHTML = "";

    if (historico.length === 0) {
        historicoList.innerHTML = "<p>Você não tem nenhuma encomenda passada no momento.</p>";
    } else {
        historico.forEach((encomenda) => {
            const encomendaDiv = document.createElement("div");
            encomendaDiv.className = "encomenda-item";

            encomendaDiv.innerHTML = `
                <p><strong>Encomenda #${encomenda.codigo}</strong></p>
                <p>
                    <span style="color: hsl(210, 17%, 25%)">Data:</span> 
                    <span style="font-weight: 500">${encomenda.dataExtenso || "Não disponível"}</span> | 
                    <span style="color: hsl(210, 17%, 25%)">Estado: </span>
                    <span style="font-weight: 500">${encomenda.estado || "Expirado"}</span>
                </p>
                <p style="margin-bottom:0">
                    <span style="color: hsl(210, 17%, 25%)">Detalhes:</span><br />
                    <ul class="mb-4">
                        <li style="font-size:0.925rem; font-weight: 500">
                            ${encomenda.detalhes || "Nenhum detalhe fornecido."}
                        </li>
                    </ul>
                </p>
                <p style="margin-bottom:0.25rem">
                    <span style="font-size: 0.95rem">
                        <span style="color: hsl(210, 17%, 25%)">Localização do cacifo:</span> 
                        <span style="font-weight: 500">${encomenda.cacifo || "Não especificado."}</span>
                    </span>
                </p>
            `;
            historicoList.appendChild(encomendaDiv);
        });
    }
}
