import express from "express";
import cors from "cors";
import { https } from "firebase-functions/v2";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();
// Debug log to verify the function starts
console.log("Starting the function...");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Debug log for environment variables
console.log("Environment variables loaded. OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// Health check route
app.get("/", (req, res) => {
  console.log("Received request at /");
  res.send("Hello from Firebase Functions!");
});

// Chat route
app.post("/chat", async (req, res) => {
  console.log("Received POST request at /chat with body:", req.body);

  // Initialize OpenAI client within the route to access the environment variable
  let openai;
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Access the API key at runtime
    });
    console.log("OpenAI client initialized successfully");
  } catch (error) {
    console.error("Error initializing OpenAI client:", error.message);
    return res.status(500).send({ error: "Failed to initialize OpenAI client" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.error("No prompt provided in the request body");
      return res.status(400).send({ error: "Prompt is required" });
    }

    console.log("Prompt received:", prompt);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response:", response.choices[0].message.content);

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error handling /chat request:", error.message);
    res.status(500).send({ error: error.message || "Internal server error" });
  }
});

// Export the Firebase function
export const api = https.onRequest(
    {
      timeoutSeconds: 120, // Extend timeout
      memory: "1GiB", // Allocate more memory
    },
    app,
);

console.log("Express app setup complete");
