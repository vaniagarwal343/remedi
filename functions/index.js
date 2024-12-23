const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {Configuration, OpenAIApi} = require("openai");
require("dotenv").config(); // Use dotenv for environment variables

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is in your .env file
});
const openai = new OpenAIApi(configuration);

// Create an Express app
const app = express();
app.use(cors({origin: true})); // Allow CORS for all origins
app.use(bodyParser.json());

// Define the /api/chat route
app.post("/api/chat", async (req, res) => {
  console.log("Request received at /api/chat:", req.body);

  try {
    const {prompt} = req.body;

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt received:", prompt);
      return res.status(400).send("Invalid prompt");
    }

    // OpenAI API call
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
    });

    console.log("OpenAI response:", response.data.choices[0].message.content);

    res.json({response: response.data.choices[0].message.content});
  } catch (error) {
    console.error("Error in /api/chat:", error.message || error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
