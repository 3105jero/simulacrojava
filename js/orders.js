

// PROTECCIÓN DE RUTA (USER)

const session = JSON.parse(localStorage.getItem("session"));

if (!session || session.role !== "user") {
  window.location.href = "login.html";
}


// URL BASE JSON SERVER

const API_URL = "http://localhost:3000";


// ELEMENTOS DEL DOM

const ordersContainer = document.getElementById("ordersContainer");


// CARGAR MIS PEDIDOS

document.addEventListener("DOMContentLoaded", loadMyOrders);

async function loadMyOrders() {
  const res = await fetch(`${API_URL}/orders`);
  const orders = await res.json();

  // Filtrar SOLO las órdenes del usuario logueado
  const myOrders = orders.filter(
    order => order.userId === session.id
  );

  ordersContainer.innerHTML = "";

  if (myOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="alert alert-info text-center">
        No tienes pedidos aún
      </div>
    `;
    return;
  }

  myOrders.forEach(order => {
    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">
          Pedido #${order.id}
        </h5>

        <p class="card-text">
          <strong>Total:</strong> $${order.total}
        </p>

        <p class="card-text">
          <strong>Estado:</strong>
          <span class="badge ${getStatusClass(order.status)}">
            ${order.status}
          </span>
        </p>

        <ul class="list-group mt-2">
          ${order.items
            .map(
              item => `
              <li class="list-group-item d-flex justify-content-between">
                <span>${item.name}</span>
                <span>$${item.price}</span>
              </li>
            `
            )
            .join("")}
        </ul>
      </div>
    `;

    ordersContainer.appendChild(card);
  });
}


// CLASES DE ESTADO (BOOTSTRAP)

function getStatusClass(status) {
  switch (status) {
    case "pending":
      return "bg-warning text-dark";
    case "preparing":
      return "bg-primary";
    case "delivered":
      return "bg-success";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}


// CERRAR SESIÓN

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}