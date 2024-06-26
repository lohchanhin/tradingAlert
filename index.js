const express = require('express');
const bodyParser = require('body-parser');
const { Client, middleware } = require('@line/bot-sdk');
const { addGroup, getGroups } = require('./database');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

// Middleware for /webhook route to verify LINE signature
app.post('/webhook', middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    for (let event of events) {
      if (event.type === 'join' || event.type === 'follow') {
        const groupId = event.source.groupId || event.source.roomId || event.source.userId;
        addGroup(groupId);
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `Hello! The group ID is: ${groupId}`
        });
      }
    }
    res.status(200).send('Event received');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing event');
  }
});

// No middleware for /alert route
app.post('/alert', bodyParser.json(), async (req, res) => {
  try {
    const alertMessage = req.body;
    getGroups(async (groupIds) => {
      for (const groupId of groupIds) {
        const lineMessage = {
          to: groupId,
          messages: [
            {
              type: 'text',
              text: `TradingView Alert: ${JSON.stringify(alertMessage)}`
            }
          ]
        };
        await client.pushMessage(lineMessage.to, lineMessage.messages);
      }
    });

    res.status(200).send('Alert received and message sent to all groups');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing alert');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
