// Endpoints
const endpoint = "http://localhost:8082/nlp/query";
const endpointProduct = "http://localhost:8082/products";
const endpointAllProducts = "http://localhost:8082/products/all";
const endpointSales = "http://localhost:8082/sales/{productID}";

const token = localStorage.getItem('Authorization');

// Funções de UI

function toggleProductForm() {
    const form = document.getElementById("productForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
}

function showOnly(elementId) {
    const sections = ["productForm", "table-products-infos", "table-sales"];

    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = (id === elementId) ? "block" : "none";
        }
    });
}


function clearSearch() {
    document.getElementById("searchInput").value = "";
}

function clearTables() {
    document.getElementById("products").innerHTML = "";
    document.getElementById("sales").innerHTML = "";
    document.getElementById("table-products").style.display = "none";
    document.getElementById("table-sales").style.display = "none";
}

// Funções de Produto

async function createProduct() {
    const name = document.getElementById("productName").value;
    const image = document.getElementById("productImage").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;

    const token = localStorage.getItem('Authorization');
    if (!token) {
        alert('Você precisa estar autenticado para criar um produto.');
        return;
    }

    const product = {
        name: name,
        image: image,
        price: price,
        stock: stock
    };

    try {
        const response = await fetch(endpointProduct, {  
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error("Erro ao criar o produto.");

        alert("Produto criado com sucesso!"); 
    } catch (error) {
        alert(error.message);
    }
}

function show(data) {
    const productsTable = document.getElementById("table-products-infos");
    const tbody = document.getElementById("products-infos");

    tbody.innerHTML = "";  

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
            <td>
                <img src="${product.imagem}" alt="${product.nome}" width="100" class="mx-auto d-block">
            </td>
            <td>R$ ${product.preço}</td>
            <td>${product.estoque}</td>
        `;
        tbody.appendChild(row);
    });
}


async function getProducts() {
    const token = localStorage.getItem("Authorization");

    if (!token) {
        window.location = "./login.html"; 
        return;
    }  

    try {
        const response = await fetch(endpointAllProducts, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
        showProducts(data);
        showOnly("table-products-infos");
    } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
        document.getElementById("products").innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar dados</td>
            </tr>`;
    }
}

function showProducts(products) {
    let table = `
        <thead>
            <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Imagem</th>
                <th>Ação</th>
            </tr>
        </thead>
        <tbody>`;

    if (products && products.length > 0) {
        for (let product of products) {
            table += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price} R$</td>
                    <td>${product.stock} Unidades</td>
                    <td><img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;"></td>
                    <td><button onclick="buyProduct('${product.id}')">Comprar</button></td>
                </tr>`;
        }
    } else {
        table += `
            <tr>
                <td colspan="5">Nenhum produto encontrado!</td>
            </tr>`;
    }

    table += `</tbody>`;
    document.getElementById("products").innerHTML = table;
}

// Funções de Vendas

function showSales(data) {
    const salesTable = document.getElementById("table-sales");
    const tbody = document.getElementById("sales");

    salesTable.style.display = "table";

    // Limpa os dados antigos antes de inserir os novos
    tbody.innerHTML = "";  

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
            <td>${sale.date || "N/A"}</td>
            <td>${sale.productName || "N/A"}</td>
            <td>R$ ${sale.productPrice || "N/A"}</td>
            <td>${sale.quantity || "N/A"}</td>
            <td>${sale.state || "N/A"}</td>
        `;
        tbody.appendChild(row);
    });
}

// Funções de Pesquisa

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchItems(); 
    }
});

async function searchItems() {
    const inputElement = document.getElementById("searchInput");
    const input = inputElement.value.trim();  

    if (!input) return;

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
            show(data);
            showOnly("table-products-infos");
        } else if (input.includes("vendas")) {
            showSales(data);
            showOnly("table-sales");
        } else {

            showOnly("table-products-infos"); 
        }

    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}
