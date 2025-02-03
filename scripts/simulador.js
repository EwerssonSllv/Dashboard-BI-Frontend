const endpoint = "https://bi-app-qvw1.onrender.com/products";
const salesEndpoint = "https://bi-app-qvw1.onrender.com/sales"; 

async function createProduct() {
    const name = document.getElementById("productName").value;
    const image = document.getElementById("productImage").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);

    const token = localStorage.getItem('Authorization');
    if (!token) {
        alert('Você precisa estar autenticado para criar um produto.');
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, image, price, stock })
        });

        if (!response.ok) throw new Error("Erro ao criar o produto.");

        alert("Produto criado com sucesso!");
        loadProducts();
    } catch (error) {
        alert(error.message);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(endpoint);
        const products = await response.json();
        
        const productList = document.getElementById("productList");
        productList.innerHTML = "";
        
        products.forEach(product => {
            const item = document.createElement("li");
            item.innerHTML = `
                ${product.id} - ${product.name} - R$${product.price} - Estoque: ${product.stock}
                <button onclick="sellProduct(${product.id})">Vender</button>
            `;
            productList.appendChild(item);
        });
    } catch (error) {
        alert("Erro ao carregar produtos.");
    }
}

async function sellProduct(productId) {
    const quantity = parseInt(prompt("Digite a quantidade a ser vendida:"));
    if (!quantity || quantity <= 0) {
        alert("Quantidade inválida.");
        return;
    }

    const token = localStorage.getItem('Authorization');
    if (!token) {
        alert('Você precisa estar autenticado para vender um produto.');
        return;
    }

    try {
        const response = await fetch(`${salesEndpoint}/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) throw new Error("Erro ao realizar a venda.");

        alert("Venda realizada com sucesso!");
        loadProducts();
    } catch (error) {
        alert(error.message);
    }
}

loadProducts();
