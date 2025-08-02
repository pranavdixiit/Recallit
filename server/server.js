import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import cardRoutes from './routes/cards.js';
import statsRoutes from './routes/stats.js';
import userRoutes from './routes/user.js';
import { connectDB } from './config/db.js';

const app = express();

const allowedOrigins = [ 'https://pranavdixiit.github.io',   // your CURRENT React frontend ngrok URL
  'http://localhost:3000'                   // if you want to allow local dev as well
  // Add any others you need
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/stats', statsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, '../client/build');

app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at port:${PORT}`);
});
