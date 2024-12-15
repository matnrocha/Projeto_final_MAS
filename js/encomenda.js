
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
                            <p><span style="color: hsl(210, 17%, 25%)">Data:</span> <span style="font-weight: 500">${encomenda.dataExtenso}</span> | <span style="color: hsl(210, 17%, 25%)">Estado: </span><span style="font-weight: 500">${encomenda.estado}</span></p>
                            <p style="margin-bottom:0"><span style="color: hsl(210, 17%, 25%)">Detalhes:</span><br />
                                <ul class="mb-4">
                                    <li style="font-size:0.925rem; font-weight: 500">
                                        ${encomenda.detalhes}
                                    </li>
                                </ul>
                            </p>
                            <p id="${encomenda.codigo}-timer" class="countdown-timer"></p>
                            <p style="margin-bottom:0.25rem">
                                <span style="font-size: 0.95rem"><span style="color: hsl(210, 17%, 25%)">Localização do cacifo:</span> <span style="font-weight: 500">${encomenda.cacifo || "Não especificado."}</span></span><br />
                                <button style="margin-left:0 !important" class="mt-3 btn btn btn-warning ms-2" onclick="alterarLocalizacao('${encomenda.codigo}')">
                                    Alterar Localização
                                </button>
                                <button class=" mt-3 btn btn btn-info ms-2" onclick="verEstado('${encomenda.estado}')">
                                    Ver Estado
                                </button>
                            </p>
                        `;
                        encomendasList.appendChild(encomendaDiv);

                        generateCountdownTimer(encomenda);
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