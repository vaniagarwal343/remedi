import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai"; // Ensure this is imported correctly
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is in your .env file
});

app.post("/api/chat", async (req, res) => {
  console.log("Request received at /api/chat:", req.body);

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt received:", prompt);
      return res.status(400).send("Invalid prompt");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response:", response.choices[0].message.content);

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in /api/chat:", error.message || error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
