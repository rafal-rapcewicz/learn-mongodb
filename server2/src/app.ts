import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { router as authRoute } from './routes/auth';
import { router as postRoute } from './routes/post';

const app: Application = express();

dotenv.config();

// connect to DB
mongoose.connect(
    <string>process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to DB')
);

// middleware
app.use(express.json()); // to have request.body parsed as json

// route middlewares
app.use('/api/user', authRoute); // this adds to authRoute routes prefix: '/api/user'
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Up & running!'));
