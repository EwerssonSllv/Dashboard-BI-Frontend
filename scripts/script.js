const Endpoint = "https://bi-app-qvw1.onrender.com/dashboards/user";

function hideLoader() {
    document.getElementById("loading").style.display = "none";
}

function show(dashboards) {
    let table = `
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Sales ID</th>
                <th scope="col">State</th>
                <th scope="col">Sale</th>
                <th scope="col">Average</th>
                <th scope="col">Amount</th>
            </tr>
        </thead>
        <tbody>`;

    if (dashboards && dashboards.length > 0) {
        for (let dashboard of dashboards) {
            if (dashboard.sale && dashboard.sale.length > 0) {
                for (let sale of dashboard.sale) {
                    table += `
                        <tr>
                            <td>${dashboard.id}</td>
                            <td>${sale.id}</td>
                            <td>${sale.state}</td>
                            <td>${sale.sale}</td>
                            <td>${sale.average}</td>
                            <td>${sale.amount}</td>
                        </tr>`;
                }
            } else {
                table += `
                    <tr>
                        <td>${dashboard.id}</td>
                        <td colspan="5">Sem vendas associadas</td>
                    </tr>`;
            }
        }
    } else {
        table += `
            <tr>
                <td colspan="6">Nenhum dashboard encontrado</td>
            </tr>`;
    }

    table += `</tbody>`;

    document.getElementById("dashboards").innerHTML = table;
}

async function getDashboard() {
    const key = "Authorization";
    const token = localStorage.getItem(key);
    
    if (!token) {
        window.location = "login.html"; 
        return;
    }  

    try {
        console.log("Token enviado:", `Bearer ${token}`);
        const response = await fetch(Endpoint, {
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
            }),
        });
        
        if (response.status === 401) {
            window.location = "login.html";
            return;
        }
        
        if (!response.ok) {
            console.error("Erro na requisição:", response.status);
            const errorData = await response.text(); 
            console.error("Detalhes do erro:", errorData);
        }
        
        const data = await response.json();
        console.log("Data recebida:", data);        
        hideLoader();
        show(data);
    } catch (error) {
        console.error("Erro ao buscar os dashboards:", error);
        hideLoader();
        document.getElementById("dashboards").innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar dados</td>
            </tr>`;
    }
}

getDashboard();
