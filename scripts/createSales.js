async function createDashboard() {
    const token = localStorage.getItem('Authorization');
    if (!token) {
        alert('Você precisa estar autenticado para criar um dashboard.');
        return;
    }

    const dashboard = {
        name: document.getElementById('dashboardName').value,
        description: document.getElementById('dashboardDescription').value,
    };

    try {
        const dashboardResponse = await fetch('https://bi-app-qvw1.onrender.com/dashboards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dashboard),
        });

        if (!dashboardResponse.ok) {
            throw new Error(`Erro ${dashboardResponse.status}: ${dashboardResponse.statusText}`);
        }

        const dashboardData = await dashboardResponse.json();
        const dashboardId = dashboardData.id;

        const sales = {
            state: document.getElementById('state').value,
            sale: parseFloat(document.getElementById('sale').value),
            average: parseFloat(document.getElementById('average').value),
            amount: parseInt(document.getElementById('amount').value),
            dashboardId: dashboardId,
        };

        const salesResponse = await fetch('https://bi-app-qvw1.onrender.com/sales/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(sales),
        });

        if (!salesResponse.ok) {
            throw new Error(`Erro ${salesResponse.status}: ${salesResponse.statusText}`);
        }

        const salesData = await salesResponse.json();
        window.location.reload(); 
    } catch (error) {
        alert('Falha ao criar Dashboard ou Sales. Verifique os dados e tente novamente.');
    }
}
