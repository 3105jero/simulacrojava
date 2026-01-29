const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (loginBtn) loginBtn.addEventListener("click", login);
  if (registerBtn) registerBtn.addEventListener("click", register);
});

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
  const users = await res.json();

  if (users.length === 0) {
    document.getElementById("error").classList.remove("d-none");
    return;
  }

  const user = users[0];

  localStorage.setItem("session", JSON.stringify(user));

  if (user.role === "admin") {
    window.location = "../admin-dashbord.html";
  } else {
    window.location = "./menu.html";
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const newUser = {
    name,
    email,
    password,
    role: "user"
  };

  await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });

  window.location.href = "login.html";
}