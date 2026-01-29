
// PROTECCIÓN DE RUTA (ROL ADMIN)

const session = JSON.parse(localStorage.getItem("session"));

if (!session || session.role !== "admin") {
  window.location.href = "login.html";
}

// URL JSON SERVER

const API_URL = "http://localhost:3000";


// ELEMENTOS DEL DOM

const totalOrdersEl = document.getElementById("totalOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const totalMoneyEl = document.getElementById("totalMoney");
const ordersTable = document.getElementById("ordersTable");

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");


// CARGAR DASHBOARD

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadOrders();
  loadProducts();
});


// DASHBOARD MÉTRICAS

async function loadDashboard() {
  const res = await fetch(`${API_URL}/orders`);
  const orders = await res.json();

  totalOrdersEl.textContent = orders.length;

  const pending = orders.filter(o => o.status === "pending");
  pendingOrdersEl.textContent = pending.length;

  const today = new Date().toISOString().split("T")[0];
  const totalMoney = orders
    .filter(o => o.date.startsWith(today))
    .reduce((sum, o) => sum + o.total, 0);

  totalMoneyEl.textContent = `$${totalMoney}`;
}


// LISTAR ÓRDENES

async function loadOrders() {
  const res = await fetch(`${API_URL}/orders`);
  const orders = await res.json();

  ordersTable.innerHTML = "";

  orders.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.userEmail}</td>
      <td>$${order.total}</td>
      <td>
        <select class="form-select form-select-sm">
          <option ${order.status === "pending" ? "selected" : ""}>pending</option>
          <option ${order.status === "preparing" ? "selected" : ""}>preparing</option>
          <option ${order.status === "delivered" ? "selected" : ""}>delivered</option>
          <option ${order.status === "cancelled" ? "selected" : ""}>cancelled</option>
        </select>
      </td>
    `;

    const select = row.querySelector("select");
    select.addEventListener("change", () =>
      updateOrderStatus(order.id, select.value)
    );

    ordersTable.appendChild(row);
  });
}


// ACTUALIZAR ESTADO DE ORDEN

async function updateOrderStatus(orderId, status) {
  await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  loadDashboard();
}


// PRODUCTOS - LISTAR

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();

  productList.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      <span>${product.name} - $${product.price}</span>
    `;

    productList.appendChild(li);
  });
}

// PRODUCTOS - CREAR

productForm.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;

  if (!name || !price) return;

  await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price: Number(price)
    })
  });

  productForm.reset();
  loadProducts();
});


// CERRAR SESIÓN

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}
