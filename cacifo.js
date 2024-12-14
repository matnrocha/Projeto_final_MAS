const cities = {
    Lisboa: {
        coords: [38.736946, -9.142685],
        cacifos: [
            { nome: "Lisboa Centro", coords: [38.736946, -9.142685] },
            { nome: "Lisboa Norte", coords: [38.750, -9.140] },
            { nome: "Lisboa Oeste", coords: [38.730, -9.180] },
        ],
    },
    Porto: {
        coords: [41.157944, -8.629105],
        cacifos: [
            { nome: "Porto Baixa", coords: [41.157944, -8.629105] },
            { nome: "Porto Matosinhos", coords: [41.181, -8.689] },
            { nome: "Porto Gaia", coords: [41.134, -8.612] },
        ],
    },
    Coimbra: {
        coords: [40.211491, -8.429184],
        cacifos: [
            { nome: "Coimbra Centro", coords: [40.211491, -8.429184] },
            { nome: "Coimbra Norte", coords: [40.222, -8.430] },
            { nome: "Coimbra Sul", coords: [40.200, -8.420] },
        ],
    },
    Faro: {
        coords: [37.017963, -7.930833],
        cacifos: [
            { nome: "Faro Aeroporto", coords: [37.017963, -7.930833] },
            { nome: "Faro Centro", coords: [37.030, -7.928] },
            { nome: "Faro Praia", coords: [37.010, -7.940] },
        ],
    },
};

// Inicializa o mapa
const map = L.map("mapa").setView(cities.Lisboa.coords, 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap',
}).addTo(map);

const markers = {};

const updateCacifos = (cidade) => {
    const cacifosList = document.getElementById("cacifos-list");
    cacifosList.innerHTML = ""; // Limpa a lista de cacifos

    Object.keys(markers).forEach((nome) => {
        map.removeLayer(markers[nome]);
        delete markers[nome];
    });

    cities[cidade].cacifos.forEach((cacifo) => {
        const cacifoItem = document.createElement("div");
        cacifoItem.className = "mb-2 p-2 border rounded bg-light";
        cacifoItem.innerHTML = `
            <strong>${cacifo.nome}</strong><br>
            <button class="btn btn-sm btn-success mt-2" onclick="reservarCacifo('${cacifo.nome}')">Reservar</button>
        `;
        cacifosList.appendChild(cacifoItem);

        markers[cacifo.nome] = L.marker(cacifo.coords)
            .addTo(map)
            .bindPopup(`${cacifo.nome}`);
    });

    map.setView(cities[cidade].coords, 13);
};

const reservarCacifo = (nomeCacifo) => {
    const modal = new bootstrap.Modal(document.getElementById("modalEscolha"));
    modal.show();
    document.getElementById("modalEscolhaLabel").innerText = `Cacifo: ${nomeCacifo}`;
    document.getElementById("acao-principal").classList.remove("d-none");
    document.getElementById("acao-encomenda").classList.add("d-none");
    document.getElementById("acao-levantamento").classList.add("d-none");
};

// Ação de Nova Encomenda
document.getElementById("novaEncomenda").addEventListener("click", () => {
    document.getElementById("acao-principal").classList.add("d-none");
    document.getElementById("acao-encomenda").classList.remove("d-none");
    document.getElementById("acao-levantamento").classList.add("d-none");
});

// Confirmação de Nova Encomenda
document.getElementById("confirmarEncomenda").addEventListener("click", () => {
    const tamanho = document.getElementById("tamanhoEncomenda").value;
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
    alert(`Reserva feita com sucesso!\nTamanho: ${tamanho}\nCódigo: ${codigo}`);
    bootstrap.Modal.getInstance(document.getElementById("modalEscolha")).hide();
});

// Ação de Levantamento
document.getElementById("levantamento").addEventListener("click", () => {
    document.getElementById("acao-principal").classList.add("d-none");
    document.getElementById("acao-encomenda").classList.add("d-none");
    document.getElementById("acao-levantamento").classList.remove("d-none");
});

// Validação de Levantamento
document.getElementById("confirmarLevantamento").addEventListener("click", () => {
    const codigo = document.getElementById("codigoLevantamentoInput").value.trim();
    if (codigo) {
        alert(`Código ${codigo} validado! Levantamento concluído.`);
        bootstrap.Modal.getInstance(document.getElementById("modalEscolha")).hide();
    } else {
        alert("Por favor, insira um código válido!");
    }
});

document.getElementById("btn-pesquisar").addEventListener("click", () => {
    const cidade = document.getElementById("cidade").value;
    updateCacifos(cidade);
});

updateCacifos("Lisboa");