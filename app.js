import express from 'express';
import cors from 'cors';
import pool from './src/db/db.js';
import { google } from 'googleapis';
import { config } from 'dotenv';

config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/:channelname', async (req, res) => {
  const channelname = req.params.channelname;
  try {
    const searchResponse = await new Promise((resolve, reject) => {
      youtube.search.list({
        part: 'id',
        type: 'channel',
        q: channelname,
        maxResults: 1
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

  const channelId = searchResponse.data.items[0].id.channelId;
  res.json(channelId);
  } catch (err) {
    console.error(err);
  }

})






app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
