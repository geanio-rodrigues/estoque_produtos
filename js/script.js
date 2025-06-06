// Mensagem de boas vindas apenas na primeira vez
document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname === "/home.html" && localStorage.getItem("welcomeMessage")) {
        showMsg(localStorage.getItem("welcomeMessage"), localStorage.getItem("statusMsg"));
        localStorage.removeItem("welcomeMessage");
    }
})

// Garantir que as mensagens são exibidas mesmo após redirecionar páginas
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("msg")){
        showMsg(localStorage.getItem("msg"), localStorage.getItem("statusMsg"));
    }

    localStorage.removeItem("msg");
})

function redirectToDashboard(type) {
    window.location.href = `dashboard.html?type=${type}`;
}

function redirectToRegister(type) {
    window.location.href = `register.html?type=${type}`;
}

function goBack() {
    if(type) {
        redirectToDashboard(type);
    } else {
        window.location.href = "home.html";
        localStorage.setItem("msg", "Página não Encontrada");
        localStorage.setItem("statusMsg", "error");
    }
}

// Recuperar o usuário logado do localStorage
const userLogged = JSON.parse(localStorage.getItem("userLogged"));

const users = JSON.parse(localStorage.getItem("users")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];
const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

async function getUserData() {
    try {
        const response = await fetch ("js/data.json");
        if(!response.ok) {
            localStorage.setItem("msg", "Erro ao carregar os dados do servidor");
            localStorage.setItem("statusMsg", "error");
        }
        const data = await response.json();
        localStorage.setItem("users", JSON.stringify(data.users || []));
        localStorage.setItem("products", JSON.stringify(data.products || []));
        localStorage.setItem("suppliers", JSON.stringify(data.suppliers || []));

        return data;
    } catch (error) {
        localStorage.setItem("msg", error.message);
        localStorage.setItem("statusMsg", "error");
        return null;
    }
}

function showMsg(message, status) {
    let elementId = status === "error" ? "error-msg" : "success-msg";
    const msgContainer = document.getElementById(elementId);

    if(msgContainer) {
        msgContainer.innerHTML = "";

        const messageElement = document.createElement("p");
        messageElement.className = elementId;
        messageElement.textContent = message;
        msgContainer.style.display = "block"; // Garantir que o bloco da mensagem seja visível
        msgContainer.appendChild(messageElement);

        // Remover a mensagem após 2 segundos
        setTimeout(() => {
            msgContainer.style.display = "none"; // Esconde o bloco da mensagem novamente
        }, 2000);
    }
}

function logoutSystem() {
    localStorage.removeItem("userLogged");
    localStorage.removeItem("users");
    localStorage.removeItem("products");
    localStorage.removeItem("suppliers");
    window.location.href = "index.html";
}

// Funções para ajudar a criar os formulários no register.html
function createInput(labelText, name, type, placeholder) {
    let div = document.createElement("div");
    div.className = "form-group";

    let label = document.createElement("label");
    label.innerText = labelText;
    label.setAttribute("for", name);

    let input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.id = name;
    input.placeholder = placeholder;
    input.className = "form-control";

    // Adicionando campo para ponto flutuante no preço
    if(name === "purchase_price") {
        input.step = "0.01";
    }

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createTextArea(labelText, name, placeholder = "") {
    let div = document.createElement("div");
    div.className = "form-group";

    let label = document.createElement("label");
    label.innerText = labelText;
    label.setAttribute("for", name);

    let textArea = document.createElement("textarea");
    textArea.name = name;
    textArea.id = name;
    textArea.placeholder = placeholder;
    textArea.className = "form-control";

    div.appendChild(label);
    div.appendChild(textArea);
    return div;
}

function createSelect(labelText, name, options) {
    let div = document.createElement("div");
    div.className = "form-group";

    let label = document.createElement("label");
    label.innerText = labelText;
    label.setAttribute("for", name);

    let select = document.createElement("select");
    select.name = name;
    select.id = name;
    select.className = "form-control";

    options.forEach(optionText => {
        let option = document.createElement("option");
        option.value = optionText;
        option.innerText = optionText;
        select.appendChild(option);
    });

    div.appendChild(label);
    div.appendChild(select);
    return div;
}