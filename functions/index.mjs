const functions = require("firebase-functions"); // Import v1 functions
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.key, // Fetch API key from Firebase config
});

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).send({ error: "Invalid prompt" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).send({ error: error.message || "Internal server error" });
  }
});

// Export the Express app as a Firebase function
exports.api = functions.https.onRequest(app);
