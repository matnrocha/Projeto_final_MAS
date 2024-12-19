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
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markers = {};

// Atualiza cacifos no mapa e na lista
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

// Remove the "Pesquisar" button event listener
document.getElementById("cidade").addEventListener("change", () => {
    const cidade = document.getElementById("cidade").value;
    updateCacifos(cidade);
});

// Inicializa com Lisboa
updateCacifos("Lisboa");

// Reservar cacifo
const reservarCacifo = (nomeCacifo) => {
    const modal = new bootstrap.Modal(document.getElementById("modalEscolha"));
    modal.show();
    document.getElementById("modalEscolhaLabel").innerText = `Cacifo: ${nomeCacifo}`;
    document.getElementById("acao-principal").classList.remove("d-none");
    document.getElementById("acao-encomenda").classList.add("d-none");
    document.getElementById("acao-levantamento").classList.add("d-none");

    // Remove event listener antes de adicionar para evitar duplicatas
    const confirmarBtn = document.getElementById("confirmarEncomenda");
    const novoConfirmarBtn = confirmarBtn.cloneNode(true); // Clona o botão para limpar todos os listeners antigos
    confirmarBtn.replaceWith(novoConfirmarBtn);

    novoConfirmarBtn.addEventListener("click", () => {
        const tamanho = document.getElementById("tamanhoEncomenda").value;
        const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();

        const data = new Date().toLocaleDateString();
        const dataExtenso = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric'});
        const novaEncomenda = {
            codigo: codigo,
            data: data,
            dataExtenso: dataExtenso,
            estado: "Reservado",
            detalhes: `Tamanho: ${tamanho}`,
            cacifo: nomeCacifo, // Adiciona o nome do cacifo à encomenda
            createdAt: new Date().getTime(), // Adiciona o tempo de criação da encomenda
        };

        const encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];
        encomendas.push(novaEncomenda);
        localStorage.setItem("encomendas", JSON.stringify(encomendas));

        // Show dialog instead of alert
        const modalConfirmacao = document.getElementById("modalConfirmacao");
        document.getElementById("modalConfirmacaoBody").innerHTML = `
            <h2>#${codigo}</h2>
            <p>Reserva feita com sucesso!</p><br><p>Verifique o estado do seu pedido em encomendas</p>
            <button type="button" class="btn btn-success" onclick="document.getElementById('modalConfirmacao').close()">Fechar</button>
        `;
        modalConfirmacao.showModal();
        bootstrap.Modal.getInstance(document.getElementById("modalEscolha")).hide();
    });
};
//levantamento
document.getElementById("confirmarLevantamento").addEventListener("click", () => {
    const codigoInserido = document.getElementById("codigoLevantamentoInput").value.trim();
    let encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

    let encomendaEncontrada = encomendas.find(encomenda => encomenda.codigo === codigoInserido);

    if (encomendaEncontrada) {
        alert(`Levantamento realizado com sucesso!\nCacifo: ${encomendaEncontrada.cacifo}\nCódigo: ${encomendaEncontrada.codigo}`);
        // Atualizar o estado para "Levantado"
        encomendaEncontrada.estado = "Levantado";
        localStorage.setItem("encomendas", JSON.stringify(encomendas));
    } else if (codigoInserido === "1234") {
        // Cria uma encomenda fictícia para o código "1234"
        const novaEncomenda = {
            codigo: "1234",
            data: new Date().toLocaleDateString(),
            dataExtenso: new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric'}),
            estado: "Reservado",
            detalhes: `Tamanho: médio`,
            cacifo: "Lisboa Centro",
            createdAt: new Date().getTime(),
        };

        encomendas.push(novaEncomenda);
        localStorage.setItem("encomendas", JSON.stringify(encomendas));

        alert(`Reserva criada e levantamento realizado com sucesso!\nCacifo: ${novaEncomenda.cacifo}\nCódigo: ${novaEncomenda.codigo}`);
        bootstrap.Modal.getInstance(document.getElementById("acao-levantamento")).hide();
    } else {
        alert("Código inválido ou encomenda não encontrada!");
        bootstrap.Modal.getInstance(document.getElementById("acao-levantamento")).hide();
    }

    // Limpa o campo de entrada após a tentativa
    document.getElementById("codigoLevantamentoInput").value = "";
});



// Ação de Nova Encomenda
document.getElementById("novaEncomenda").addEventListener("click", () => {
    document.getElementById("acao-principal").classList.add("d-none");
    document.getElementById("acao-encomenda").classList.remove("d-none");
    document.getElementById("acao-levantamento").classList.add("d-none");
});

//Ação de Levantamento
$("#levantamento").on("click", function () {
    $("#acao-principal").addClass("d-none");
    $("#acao-encomenda").addClass("d-none");
    $("#acao-levantamento").removeClass("d-none");
});

updateCacifos("Lisboa");

document.getElementById("levantamento").addEventListener("click", () => {
    document.getElementById("acao-principal").classList.add("d-none");
    document.getElementById("acao-encomenda").classList.add("d-none");
    document.getElementById("acao-levantamento").classList.remove("d-none");
});




