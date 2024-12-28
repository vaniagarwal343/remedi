import * as functions from "firebase-functions";
import { OpenAI } from "openai";

export const api = functions.https.onRequest(async (req, res) => {
  // Enable CORS - modify to match your frontend domain
  res.set("Access-Control-Allow-Origin", "https://remedicate-app.web.app");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).send("No prompt provided");
      return;
    }

    const openai = new OpenAI({
      apiKey: functions.config().openai.key,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});
