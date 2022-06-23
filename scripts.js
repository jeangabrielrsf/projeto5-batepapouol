let mensagens;
let nome;

function perguntaNome () {
    nome = prompt("Qual é o seu nome?");
    let objNome = {
        name:nome
    };
    alert(`Olá, ${nome}`);
    const promessa = axios.post ("https://mock-api.driven.com.br/api/v6/uol/participants", objNome);
    promessa.then(nomeOK);
    promessa.catch(erroNome);
}

function buscarMensagens () {
    const requisicao = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    requisicao.then(buscaOK);
}


function manterConexao () {
    let objNome = {
        name: nome
    }
    const pedido = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",objNome);
}

function nomeOK(resposta) {
    const code = resposta.status;

    if (code === 200) {
        setInterval(manterConexao, 5000);
    }
    
}

function erroNome (erro) {
    const code = erro.response.status;
    if (code === 400) {
        alert("Já existe um usuário com esse nome.");
    }
}

function buscaOK(resposta) {
    mensagens = resposta.data;
    mostrarMensagens();
}



function mostrarMensagens() {
    const ulMensagens = document.querySelector(".conteudo");
    
    ulMensagens.innerHTML = "";

    for (let i=0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {
            ulMensagens.innerHTML += `
            <li class="status">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="autor">${mensagens[i].from}</span>
                <span class="texto">${mensagens[i].text}</span>
            </li>
            `;
        } else if (mensagens[i].type === "message") {
            ulMensagens.innerHTML += `
            <li class="mensagem">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="autor">${mensagens[i].from}</span>
                <span class="destino">para <span class="forte">${mensagens[i].to}:</span></span>
                <span class="texto">${mensagens[i].text}</span>
            </li>
            `; 
        } else {
            ulMensagens.innerHTML += `
            <li class="reservada">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="autor">${mensagens[i].from}</span>
                <span class="destino">reservadamente para <span class="forte">${mensagens[i].to}:</span></span>
                <span class="texto">${mensagens[i].text}</span>
            </li>
            `; 
        }
        
    }
    ulMensagens.scrollIntoView(false);
}



function postarMensagem () {

    const texto = document.querySelector("input").value;
    const destino = "Todos";
    const tipo = "message";

    const objPostar = {
        from:nome,
        text:texto,
        to:destino,
        type:tipo
    };

    axios.post ("https://mock-api.driven.com.br/api/v6/uol/messages", objPostar);

}


perguntaNome();
setInterval(buscarMensagens,3000);
