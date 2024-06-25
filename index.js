const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();
app.use(middleware(config));

app.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.type === 'join' || event.type === 'follow') {
    const groupId = event.source.groupId || event.source.roomId || event.source.userId;
    console.log(`Joined group with ID: ${groupId}`);

    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: `Hello! The group ID is: ${groupId}`
    });
  }

  return Promise.resolve(null);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
