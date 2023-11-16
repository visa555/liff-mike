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

app.post("/send-message", async (req, res) => {
  try {
    const { userId, message } = req.body;
    const body = {
      to: userId,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };

    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      body,
      { headers }
    );
    res.json({ message: "Success", responseData: response.data });
  } catch (error) {
    console.log(error);
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
