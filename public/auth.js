
const BACKEND_URL = "https://YOUR-RENDER-APP-NAME.onrender.com";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

async function signup() {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    // ✅ CHANGED: Uses full Render URL
    const res = await fetch(`${BACKEND_URL}/api/signup`, {
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
  } catch (error) {
    console.error("Signup Error:", error);
    msg.textContent = "Connection error. Check console.";
    msg.style.color = "red";
  }
}

async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    // ✅ CHANGED: Uses full Render URL
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    msg.textContent = data.message;

    if (res.ok) {
      // ✅ SAVE USER SESSION
      localStorage.setItem("user", email);
      
      // Redirect stays relative because index.html is on the same Firebase host
      window.location.href = "/"; 
    } else {
      msg.style.color = "red";
    }
  } catch (error) {
    console.error("Login Error:", error);
    msg.textContent = "Connection error. Check console.";
    msg.style.color = "red";
  }
}