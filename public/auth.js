const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

async function signup() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  msg.textContent = data.message;

  if (res.ok) {
    msg.style.color = "green";
  } else {
    msg.style.color = "red";
  }
}

async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  msg.textContent = data.message;

  if (res.ok) {
    // ✅ SAVE USER SESSION
    localStorage.setItem("user", email);
    window.location.href = "/";
  } else {
    msg.style.color = "red";
  }
}
