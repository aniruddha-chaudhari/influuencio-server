import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './src/routes/authRoutes.js';
import infoRoutes from './src/routes/infoRoutes.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // or your React app's URL
  credentials: true
}));

// Session configuration
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json());

// Use auth routes
app.use('/', authRoutes);
app.use('/info', infoRoutes);

// For debugging: log session data on each request
app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});



// app.get('/:channelname', async (req, res) => {
//   const channelname = req.params.channelname;
//   try {
//     // Search for the channel
//     const searchResponse = await youtube.search.list({
//       part: 'id',
//       type: 'channel',
//       q: channelname,
//       maxResults: 1
//     });

//     if (searchResponse.data.items.length === 0) {
//       return res.status(404).json({ error: 'Channel not found' });
//     }

//     const channelId = searchResponse.data.items[0].id.channelId;

//     const channelResponse = await youtube.channels.list({
//       part: 'statistics',
//       id: channelId
//     });

//     if (channelResponse.data.items.length === 0) {
//       return res.status(404).json({ error: 'Channel statistics not found' });
//     }

//     const statistics = channelResponse.data.items[0].statistics;


//   res.json({
//       subscriberCount: statistics.subscriberCount
//     })
//     console.log(statistics.subscriberCount);
//   } catch (err) {
//     console.error(err);
//   }

// })




const port = 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
