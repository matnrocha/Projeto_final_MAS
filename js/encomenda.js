
document.addEventListener("DOMContentLoaded", function () {
const encomendasList = document.getElementById("encomendas-list");
const encomendas = JSON.parse(sessionStorage.getItem("encomendas")) || [];

if (encomendas.length === 0) {
encomendasList.innerHTML = "<p>Você não tem nenhuma encomenda no momento.</p>";
} else {
// Remove duplicatas (se necessário)
const encomendasUnicas = [];
encomendas.forEach((encomenda) => {
 const existe = encomendasUnicas.find(e => e.codigo === encomenda.codigo);
 if (!existe) encomendasUnicas.push(encomenda);
});

encomendasUnicas.forEach((encomenda) => {
 const encomendaDiv = document.createElement("div");
 encomendaDiv.className = "encomenda-item";

 encomendaDiv.innerHTML = `
     <p><strong>Encomenda #${encomenda.codigo}</strong></p>
     <p>Data: ${encomenda.data} | Estado: ${encomenda.estado}</p>
     <p>Detalhes: ${encomenda.detalhes}</p>
     <p>Localização do cacifo: ${encomenda.cacifo || "Não especificado"}</p>
     <button class="btn btn-warning btn-sm" onclick="alterarCacifo('${encomenda.codigo}')">
         Alterar Cacifo
     </button>
 `;
 encomendasList.appendChild(encomendaDiv);
});
}
});

// Função para alterar o cacifo
const alterarCacifo = (codigoEncomenda) => {
alert(`Alterar cacifo para a encomenda #${codigoEncomenda}`);
// Aqui você pode redirecionar o usuário de volta à página de cacifos ou exibir uma modal
};


