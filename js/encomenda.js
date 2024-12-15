
            document.addEventListener("DOMContentLoaded", function () {
                const encomendasList = document.getElementById("encomendas-list");
                const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || [];
    
                if (encomendas.length === 0) {
                    encomendasList.innerHTML = "<p>Você não tem nenhuma encomenda no momento.</p>";
                } else {
                    encomendas.forEach((encomenda) => {
                        const encomendaDiv = document.createElement("div");
                        encomendaDiv.className = "encomenda-item";
    
                        encomendaDiv.innerHTML = `
                            <p><strong>Encomenda #${encomenda.codigo}</strong></p>
                            <p>Data: ${encomenda.data} | Estado: ${encomenda.estado}</p>
                            <p>Detalhes: ${encomenda.detalhes}</p>
                            <p>
                                Localização do cacifo: ${encomenda.cacifo || "Não especificado"}
                                <button class="btn btn-sm btn-warning ms-2" onclick="alterarLocalizacao('${encomenda.codigo}')">
                                    Alterar Localização
                                </button>
                                <button class="btn btn-sm btn-info ms-2" onclick="verEstado('${encomenda.estado}')">
                                    Ver Estado
                                </button>
                            </p>
                        `;
                        encomendasList.appendChild(encomendaDiv);
                    });
                }
            });
    
            const verEstado = (estado) => {
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
            };
    
            const alterarLocalizacao = (codigoEncomenda) => {
                sessionStorage.setItem("alterarEncomenda", codigoEncomenda);
                window.location.href = "cacifo.html";
            };