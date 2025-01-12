const Endpoint = "https://bi-app-qvw1.onrender.com/auth/login";

async function signin() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    console.log(login, password);

    const response = await fetch(Endpoint, {
      method: "POST",  // Alterei de GET para POST
      headers: new Headers({
          "Content-Type": "application/json; charset=utf8",
      }),
      body: JSON.stringify({ login: login, password: password }),
    });

    let key = "Authorization";
    if (response.ok) {
        const data = await response.json();
        let token = data.token;  
        console.log("Token:", token);

        if (token) {
            window.localStorage.setItem(key, token);
            window.location = "index.html";  
        }

        showToast("#okToast");
    } else {
        showToast("#errorToast");
    }
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
