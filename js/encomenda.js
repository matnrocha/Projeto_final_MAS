document.addEventListener("DOMContentLoaded", function () {
    const encomendasList = document.getElementById("encomendas-list");
    const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || []; // Recupera as encomendas do Session Storage

    if (encomendas.length === 0) {
        encomendasList.innerHTML = "<p>Você não tem nenhuma encomenda no momento.</p>";
    } else {
        encomendas.forEach((encomenda) => {
            // Cria a estrutura de cada encomenda
            const encomendaDiv = document.createElement("div");
            encomendaDiv.className = "encomenda-item";
            encomendaDiv.innerHTML = `
                <p><strong>Encomenda #${encomenda.codigo}</strong></p>
                <p>Data: ${encomenda.data} | Estado: ${encomenda.estado}</p>
                <p>Detalhes: ${encomenda.detalhes}</p>
                <button class="btn btn-primary btn-sm btn-detalhes" onclick="alert('Detalhes da encomenda #${encomenda.codigo}')">Ver Detalhes</button>
            `;
            encomendasList.appendChild(encomendaDiv);
        });
    }
});