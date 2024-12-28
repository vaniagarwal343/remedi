import { onRequest } from "firebase-functions/v2/https";
import { OpenAI } from "openai";

export const api = onRequest({
  cors: ["https://remedicate-app.web.app", "https://remedicate-app.firebaseapp.com"]
}, async (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).send("No prompt provided");
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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