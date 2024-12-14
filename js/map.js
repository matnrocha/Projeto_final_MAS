$(function(){
    $("#btn-pesquisar").on("click", function(){
        const cidade = $("#cidade").val()
        const mapa = $("#mapa")

        mapa.innerHTML = `
            <h4 class="text-center mt-4">${cidade}</h4>
            <ul class="list-group mt-3">
                <li class="list-group-item">Cacifo 1 - ${cidade} Centro</li>
                <li class="list-group-item">Cacifo 2 - ${cidade} Norte</li>
                <li class="list-group-item">Cacifo 3 - ${cidade} Sul</li>
            </ul>
        `
    })
})