const API_URL = "http://localhost:3000";


// PROTECCIÓN DE RUTA

const session = JSON.parse(localStorage.getItem("session"));

if (!session || session.role !== "user") {
  window.location.href = "login.html";
}

let cart = [];


// EVENTOS INICIALES

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  document
    .getElementById("confirmOrder")
    .addEventListener("click", createOrder);

  document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);
});


// DELEGACIÓN DE EVENTOS (CLAVE)

document.getElementById("products").addEventListener("click", e => {
  if (e.target.classList.contains("add-btn")) {
    const btn = e.target;

    addToCart(
      btn.dataset.id,
      btn.dataset.name,
      Number(btn.dataset.price)
    );
  }
});


// CARGAR PRODUCTOS

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img 
            src="${p.image || "https://via.placeholder.com/150"}" 
            class="card-img-top"
          >
          <div class="card-body">
            <h6>${p.name}</h6>
            <p>$${p.price}</p>
            <button
              class="btn btn-sm btn-success add-btn"
              data-id="${p.id}"
              data-name="${p.name}"
              data-price="${p.price}">
              Add to order
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


// CARRITO

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart");
  const totalSpan = document.getElementById("total");

  list.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        ${item.name}
        <span>$${item.price}</span>
      </li>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
}
// CREAR ORDEN
async function createOrder() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const order = {
    userId: session.id,
    items: cart,
    total,
    status: "pending",
    date: new Date().toISOString()
  };

  await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });

  cart = [];
  renderCart();
  alert("Order created!");
}
// LOGOUT
function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}
