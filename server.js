require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Models
const User = require("./models/User");
const Chat = require("./models/Chat");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* ================= DATABASE ================= */
mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= GEMINI SETUP ================= */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ WORKING MODEL
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/* ================= AUTH ================= */

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });

  res.json({ message: "Signup successful" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", email });
});

/* ================= GEMINI CHAT ================= */

/* ================= GEMINI CHAT ================= */

app.post("/api/chat", async (req, res) => {
  try {
    const { message, userEmail } = req.body;

    if (!message || !userEmail) {
      return res.status(400).json({ reply: "Invalid request" });
    }

    const result = await model.generateContent(message);
    const reply = result.response.text();

    await Chat.create({
      userEmail,
      message,
      reply
    });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini error:", err.message);

    res.json({
      reply: "⚠️ Gemini AI is unavailable or quota exceeded."
    });
  }
});


/* ================= HISTORY ================= */

app.get("/api/history/:email", async (req, res) => {
  const chats = await Chat.find({ userEmail: req.params.email });
  res.json(chats);
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("✅ one.ai running at http://localhost:3000");
});
