const endpoint = "http://localhost:8082/nlp/query";

document.getElementById("searchInput").addEventListener("keydown", searchItems);

async function searchItems(event) {

    if (event.key !== "Enter") return;

    const input = document.getElementById("searchInput").value.trim();
    const token = localStorage.getItem("Authorization");

    if (!token) {
        window.location = "./login.html";
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ command: input }),
        });

        if (response.status === 401) {
            window.location = "./login.html";
            return;
        }

        if (!response.ok) {
            console.error("Erro na requisição:", response.status);
            return;
        }

        const data = await response.json();

        clearTables();

        if (input.includes("estoque do produto")) {
            showProducts(data);
        } else if (input.includes("vendas de hoje")) {
            showSales(data);
        }

    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

function clearTables() {
    document.getElementById("products").innerHTML = "";
    document.getElementById("sales").innerHTML = "";
    document.getElementById("table-products").style.display = "none";
    document.getElementById("table-sales").style.display = "none";
}

function showProducts(data) {
    const productsTable = document.getElementById("table-products");
    const tbody = document.getElementById("products");

    productsTable.style.display = "table";

    productsTable.querySelector("thead").innerHTML = ` 
        <tr>
            <th>Produto</th>
            <th>Imagem</th>
            <th>Preço</th>
            <th>Estoque</th>
        </tr>
    `;
    data.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.nome}</td>
            <td><img src="${product.imagem}" alt="${product.nome}" width="50"></td>
            <td>R$ ${product.preço}</td>
            <td>${product.estoque}</td>
        `;
        tbody.appendChild(row);
    });
}

function showSales(data) {
    const salesTable = document.getElementById("table-sales");
    const tbody = document.getElementById("sales");

    salesTable.style.display = "table";

    salesTable.querySelector("thead").innerHTML = `
        <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Estado</th>
        </tr>
    `;

    data.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.productName}</td>
            <td>R$ ${sale.productPrice}</td>
            <td>${sale.quantity}</td>
            <td>${sale.state}</td>
        `;
        tbody.appendChild(row);
    });
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
}
