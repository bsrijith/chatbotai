
const BACKEND_URL = "https://YOUR-RENDER-APP-NAME.onrender.com";

async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  if (!input.value.trim()) return;

  const userEmail = localStorage.getItem("user");

  if (!userEmail) {
    alert("Please login first");
    return;
  }

  // Show user message locally immediately
  chat.innerHTML += `<p class="user">${input.value}</p>`;

  const userMessage = input.value;
  input.value = ""; // Clear input

  try {
    // ✅ CHANGED: Uses full Render URL
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        userEmail: userEmail
      })
    });

    const data = await res.json();

    chat.innerHTML += `<p class="bot">${data.reply}</p>`;
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    console.error(err);
    chat.innerHTML += `<p class="bot">Server error 😢 (Check console)</p>`;
  }
}