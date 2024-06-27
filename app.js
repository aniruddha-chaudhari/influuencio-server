import express, { response } from 'express';
import cors from 'cors';
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

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);




app.get('/:channelname', async (req, res) => {
  const channelname = req.params.channelname;
  try {
    // Search for the channel
    const searchResponse = await youtube.search.list({
      part: 'id',
      type: 'channel',
      q: channelname,
      maxResults: 1
    });

    if (searchResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channelId = searchResponse.data.items[0].id.channelId;

    const channelResponse = await youtube.channels.list({
      part: 'statistics',
      id: channelId
    });

    if (channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel statistics not found' });
    }

    const statistics = channelResponse.data.items[0].statistics;


  res.json({
      subscriberCount: statistics.subscriberCount
    })
    console.log(statistics.subscriberCount);
  } catch (err) {
    console.error(err);
  }

})






app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
