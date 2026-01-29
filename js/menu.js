

const API_URL = "http://localhost:3000";

const session = JSON.parse(localStorage.getItem("session"));
if (!session || session.role !== "user") {
  window.location.href = "login.html";
}

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  document.getElementById("confirmOrder").addEventListener("click", createOrder);
  document.getElementById("logoutBtn").addEventListener("click", logout);
});

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${p.image || 'https://via.placeholder.com/150'}">
          <div class="card-body">
            <h6>${p.name}</h6>
            <p>$${p.price}</p>
            <button class="btn btn-sm btn-success"
              onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
              Add to order
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

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

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}