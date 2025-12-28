async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  if (!input.value.trim()) return;

  const userEmail = localStorage.getItem("user");

  if (!userEmail) {
    alert("Please login first");
    return;
  }

  // Show user message
  chat.innerHTML += `<p class="user">${input.value}</p>`;

  const userMessage = input.value;
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        userEmail: userEmail   // ✅ FIX HERE
      })
    });

    const data = await res.json();

    chat.innerHTML += `<p class="bot">${data.reply}</p>`;
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    chat.innerHTML += `<p class="bot">Server error 😢</p>`;
  }
}

