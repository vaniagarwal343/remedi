import { onRequest } from "firebase-functions/v2/https";
import { OpenAI } from "openai";

const SYSTEM_PROMPT = `You are a medical management assistant for the Remedicate app. Your role is to:
- Provide general health information and medication adherence support
- Ask relevant follow-up questions when users report symptoms
- Always acknowledge user's existing medical conditions and medications when providing advice
- Include appropriate medical disclaimers when giving health-related information
- Never provide specific medical diagnoses or change medication advice
- Encourage users to consult healthcare professionals for specific medical concerns

When discussing medications:
- Reference user's current medication list if available
- Ask about timing of doses and adherence
- Mention potential general interactions if multiple medications are listed
- Remind users about the importance of taking medications as prescribed

For symptom-related questions:
- Ask about duration and severity
- Consider user's existing conditions and medications
- Provide general self-care suggestions while encouraging professional medical consultation when appropriate`;

export const api = onRequest({
  cors: {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 3600
  }
}, async (req, res) => {
  try {
    const { prompt, userProfile, conversationHistory } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: "No prompt provided" });
      return;
    }

    console.log("Received user profile:", userProfile); // Debug log

    let contextualizedMessages = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    if (userProfile) {
      const profileContext = `Current User Profile:
Name: ${userProfile.name || 'Not provided'}
Allergies: ${userProfile.allergies || 'None listed'}
Medical Conditions: ${userProfile.conditions || 'None listed'}
Current Medications: ${userProfile.medications?.length ? 
  userProfile.medications.map(med => 
    `${med.medicationName} (${med.dosage}, ${med.frequency})`
  ).join(', ') : 'None listed'}`;

      contextualizedMessages.push({
        role: "system",
        content: profileContext
      });
    }

    if (conversationHistory?.length) {
      contextualizedMessages = [
        ...contextualizedMessages,
        ...conversationHistory.slice(-5)
      ];
    }

    contextualizedMessages.push({
      role: "user",
      content: prompt
    });

    console.log("Sending messages to OpenAI:", contextualizedMessages); // Debug log

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: contextualizedMessages,
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ 
      response: response.choices[0].message.content,
      messageId: response.id
    });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      error: "Error processing request",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});