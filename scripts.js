let mensagens;
let nome;
let participantes;

function perguntaNome () {
    nome = prompt("Qual é o seu nome?");
    let objNome = {
        name:nome
    };
    const promessa = axios.post ("https://mock-api.driven.com.br/api/v6/uol/participants", objNome);
    promessa.then(nomeOK);
    promessa.catch(erroNome);
}

function nomeOK(resposta) {
    const code = resposta.status;
    if (code === 200) {
        manterConexao();
        setInterval(manterConexao, 5000);
    }
    
}

function erroNome (erro) {
    const code = erro.response.status;
    if (code !== 200) {
        alert("Algo deu errado.");
        perguntaNome();
    }
}

function manterConexao () {
    let objNome = {
        name: nome
    }
    const pedido = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",objNome);
}

function buscarMensagens () {
    const requisicao = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    requisicao.then(buscaOK);
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
                <div class="hora">(${mensagens[i].time})</div>
                <div class="autor">${mensagens[i].from}</div>
                <div class="texto">${mensagens[i].text}</div>
            </li>
            `;
        } else if (mensagens[i].type === "message") {
            ulMensagens.innerHTML += `
            <li class="mensagem">
                <div class="hora">(${mensagens[i].time})</div>
                <div class="autor">${mensagens[i].from}</div>
                <div class="destino">para <div class="forte">${mensagens[i].to}:</div></div>
                <div class="texto">${mensagens[i].text}</div>
            </li>
            `; 
        } else if (mensagens[i].to === nome && mensagens[i].type === "private_message") {
            ulMensagens.innerHTML += `
            <li class="reservada">
                <div class="hora">(${mensagens[i].time})</div>
                <div class="autor">${mensagens[i].from}</div>
                <div class="destino">reservadamente para <div class="forte">${mensagens[i].to}:</div></div>
                <div class="texto">${mensagens[i].text}</div>
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

    const promise = axios.post ("https://mock-api.driven.com.br/api/v6/uol/messages", objPostar);
    promise.then(postagemOK);
    promise.catch(erroPostagem);

}


function postagemOK (resposta) {
    const code = resposta.status;
    console.log (code);
    if (code === 200) {
        buscarMensagens();
    }
}


function erroPostagem (erro) {
    const errorCode = erro.response.status;
    console.log(errorCode);
    if (errorCode !== 200) {
        window.location.reload();
    }
}




// function postarMensagemEnter () {
//     // Get the input field
//     let input = document.querySelector(".barra-inferior .campo-texto input");

//     // Execute a function when the user presses a key on the keyboard
//     input.addEventListener("keypress", function(event) {
//     // If the user presses the "Enter" key on the keyboard
//     if (event.key === "Enter") {
//         // Cancel the default action, if needed
//         event.preventDefault();
//         // Trigger the button element with a click
//         document.querySelector(".barra-inferior .icone").click();
//     }
//     });
// }


function buscarParticipantes () {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(guardaParticipantes);
}

function guardaParticipantes (resposta) {
    participantes = resposta.data;
    listarParticipantes(participantes);
}


function listarParticipantes (participantes) {
    const usuarios = document.querySelector(".menu-lateral .participantes")
    usuarios.innerHTML = "";
    for (let i=0; i < participantes.length; i++) {
        usuarios.innerHTML += `
            <li class="usuario">
                <span class="icone"><ion-icon name="person-circle"></ion-icon></span>
                <span class="nome-usuario">${participantes[i].name}</span>
            </li>
        `;
    }
}

function mostrarSidebar() {
    const sidebar = document.querySelector(".menu-lateral");
    const overchat = document.querySelector(".sombra");
    sidebar.classList.toggle("escondido");
    overchat.classList.remove("escondido");
}

function esconderSidebar () {
    const sidebar = document.querySelector(".menu-lateral");
    const chat = document.querySelector(".sombra");
    if (chat !== null) {
        chat.classList.add("escondido");
        sidebar.classList.add("escondido");
    }
}


perguntaNome();
setInterval(buscarMensagens,3000);
buscarParticipantes();
setInterval(buscarParticipantes,10000);
