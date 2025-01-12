const Endpoint = "https://bi-app-qvw1.onrender.com/auth/register";

async function signup() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let role = "USER";

    console.log(login, password);

    const response = await fetch(Endpoint, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=utf8",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        login: login,
        password: password,
        role: role
      }),
    });

    if (response.ok) {
        signin(); 
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
