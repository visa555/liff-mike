const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const LINT_BOT_API = "https://api.line.me/v2/bot";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
};

const sendMessage = async (userId, message) => {
  try {
    const body = {
      to: userId,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };

    const response = await axios.post(`${LINT_BOT_API}/message/push`, body, {
      headers
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
app.post("/send-message", async (req, res) => {
  try {
    const { userId, message } = req.body;
    const response = await sendMessage(userId, message);
    res.json({ message: "Success", responseData: response.data });
  } catch (error) {
    res.json({
      message: error.message,
      header: headers
    });
  }
});
app.post("/webhook", async (req, res) => {
  const { events } = req.body;

  if (events && events.length === 0) {
    res.json({ message: "ok" });
    return;
  }
  const lineEvent = events[0];
  const userId = lineEvent.source.userId;
  try {
    const response = await sendMessage(userId, "Hello From Webhook");
    res.json({ message: "Success", responseData: response.data });
  } catch (error) {
    res.json({
      message: error.message,
      header: headers
    });
  }
});
const PORT = "8888";
app.listen(PORT, (req, res) => {
  console.log(`Run at http://localhost:${PORT}`);
});
