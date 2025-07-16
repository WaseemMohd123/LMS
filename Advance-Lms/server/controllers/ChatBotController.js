import { CAE } from "../middleware/catchAsyncError.js";
import axios from "axios";

const ChatBotController = CAE(async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Mistral API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Mistral AI." });
  }
});

export default ChatBotController;
