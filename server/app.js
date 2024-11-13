import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routers/AuthRouter.js';
import userRouter from './routers/UserRouter.js';
import adminRouter from './routers/AdminRouter.js';
import parentRouter from './routers/ParentRouter.js';
import busRouter from './routers/BusRouter.js';
import routeRouter from './routers/RouteRouter.js';
import config from './config/config.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    cors({
        origin: config.FRONT_URL,
        credential: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms'));

// Route handling
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/parent', parentRouter);
app.use('/api/bus', busRouter);
app.use('/api/route', routeRouter);

app.all('*', (_req, res) => {
    return res.status(404).json({ message: 'API Not Found' });
});

export default app;
