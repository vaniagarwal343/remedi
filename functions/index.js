import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai"; // Correct spacing

// Initialize the OpenAI client using Firebase config
const configuration = new Configuration({
  apiKey: functions.config().openai.api_key, // Fetch from Firebase config
});
const openai = new OpenAIApi(configuration);

// Create an Express app
const app = express();
app.use(cors({ origin: true })); // Allow CORS for all origins
app.use(express.json()); // Use express.json() instead of body-parser

// Define the /api/chat route
app.post("/api/chat", async (req, res) => {
  console.log("Request received at /api/chat:", req.body);

  try {
    const { prompt } = req.body; // Correct spacing

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt received:", prompt);
      return res.status(400).send("Invalid prompt");
    }

    // OpenAI API call
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response:", response.data.choices[0].message.content);

    res.json({
      response: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error.message || error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
