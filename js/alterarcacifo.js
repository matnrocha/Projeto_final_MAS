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


// Reservar cacifo
const reservarCacifo = (nomeCacifo) => {
    const modal = new bootstrap.Modal(document.getElementById("modalEscolha"));
    modal.show();

    // Atualiza o título do modal com o nome do cacifo
    document.getElementById("modalEscolhaLabel").innerText = `Cacifo: ${nomeCacifo}`;

    // Oculta as outras seções do modal
    document.getElementById("acao-principal").classList.add("d-none");
    document.getElementById("acao-levantamento").classList.add("d-none");

    // Mostra apenas a seção de confirmação de encomenda
    const acaoEncomenda = document.getElementById("acao-encomenda");
    acaoEncomenda.classList.remove("d-none");

    // Configura o botão de confirmação para reservar o cacifo
    const confirmarBtn = document.getElementById("confirmarEncomenda");
    const novoConfirmarBtn = confirmarBtn.cloneNode(true); // Clona o botão para evitar múltiplos listeners
    confirmarBtn.replaceWith(novoConfirmarBtn);

    novoConfirmarBtn.addEventListener("click", () => {
        const tamanho = document.getElementById("tamanhoEncomenda").value;
        
        // Busca o array de encomendas no sessionStorage
        const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || [];
        
        // Busca a encomenda existente (se houver) e remove do array
        const indexEncomenda = encomendas.findIndex((e) => e.cacifo === nomeCacifo);
        let codigo;

        if (indexEncomenda !== -1) {
            // Se a encomenda já existir, usa o mesmo código
            codigo = encomendas[indexEncomenda].codigo;
            encomendas.splice(indexEncomenda, 1); // Remove a encomenda antiga
        } else {
            // Se não existir, gera um novo código
            codigo = codigoEncomenda;
            encomendas.splice(indexEncomenda, 1);
        }

        // Cria uma nova encomenda com o código reutilizado ou gerado
        const novaEncomenda = {
            codigo: codigo,
            data: new Date().toLocaleDateString(),
            dataExtenso: new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' }),
            estado: "Reservado",
            detalhes: `Tamanho: ${tamanho}`,
            cacifo: nomeCacifo,
            createdAt: new Date().getTime(),
        };

        // Adiciona a nova encomenda ao array
        encomendas.push(novaEncomenda);

        // Salva o array atualizado no sessionStorage
        sessionStorage.setItem("encomendas", JSON.stringify(encomendas));

        // Redireciona ou notifica o usuário
        alert(`Encomenda atualizada com sucesso! Código: ${codigo}`);
        window.location.href = "http://localhost:5292/Projeto_final_MAS/encomenda.html";
    });
};

// Captura o código de encomenda da URL
const urlParams = new URLSearchParams(window.location.search);
const codigoEncomenda = urlParams.get("codigoEncomenda");

if (codigoEncomenda) {
    const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || [];
    const encomenda = encomendas.find((e) => e.codigo === codigoEncomenda);

    if (encomenda) {
        alert(`Alteração detectada!\nEncomenda: ${encomenda.codigo}\nCacifo Atual: ${encomenda.cacifo}`);
    }
}

// Pesquisa inicial em Lisboa
document.getElementById("btn-pesquisar").addEventListener("click", () => {
    const cidade = document.getElementById("cidade").value;
    updateCacifos(cidade);
});

// Inicializa com Lisboa
updateCacifos("Lisboa");    