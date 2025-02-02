// const signupEndpoint = "https://bi-app-qvw1.onrender.com/auth/register";
// const signinEndpoint = "https://bi-app-qvw1.onrender.com/auth/login";

const signupEndpoint = "http://localhost:8082/auth/register"
const signinEndpoint = "http://localhost:8082/auth/login"

async function signup() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let state = document.getElementById("state").value;

    const response = await fetch(signupEndpoint, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            login: login,
            state: state,
            password: password
        }),
    });

    if (response.ok) {
        signin();  
    } else {
        try {

            const errorData = await response.json();
            if (errorData.message && errorData.message.includes("User already exists!")) {
                showToast("#errorToast", "O Usuário já existe!");  
            } else {
                console.error("Erro no registro:", errorData);
                showToast("#errorToast", errorData.message || "Erro ao realizar o registro.");
            }
        } catch (e) {
            console.error("Erro ao tentar processar a resposta do servidor:", e);
            showToast("#errorToast", "Erro inesperado no servidor. É possível que o usuário já exista");
        }
    }
}

async function signin() {
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(signinEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            if (token) {
                window.localStorage.setItem("Authorization", token);
                console.log("Login realizado com sucesso!");
                window.location = "index.html"; 
            }
            showToast("#okToast", "Login bem-sucedido!");
        } else {
            const errorData = await response.json();

            if (errorData.message && errorData.message.includes("User not found!")) {
                showToast("#errorToast", "Usuário não encontrado. Verifique seu login e tente novamente.");
            } else {
                console.error("Erro no login:", errorData);
                showToast("#errorToast", errorData.message || "Erro ao realizar login.");
            }
        }
    } catch (error) {
        showToast("#errorToast", "Erro inesperado ao realizar login.");
    }
}

function showToast(id, message) {
    const toastEl = document.querySelector(id);
    if (toastEl) {
        const messageEl = toastEl.querySelector(".toast-body");
        if (messageEl) messageEl.textContent = message; 
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}
