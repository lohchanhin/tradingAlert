const express = require('express');
const bodyParser = require('body-parser');
const { Client, middleware } = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();
app.use(middleware(config));
app.use(bodyParser.json());

const LINE_GROUP_ID = process.env.LINE_GROUP_ID;

app.post('/webhook', async (req, res) => {
  try {
    const alertMessage = req.body;
    const lineMessage = {
      to: LINE_GROUP_ID,
      messages: [
        {
          type: 'text',
          text: `TradingView Alert: ${JSON.stringify(alertMessage)}`
        }
      ]
    };

    await client.pushMessage(lineMessage.to, lineMessage.messages);

    res.status(200).send('Alert received and message sent to group');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing alert');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
