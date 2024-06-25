const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
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

        await axios.post('https://api.line.me/v2/bot/message/push', lineMessage, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
            }
        });

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
