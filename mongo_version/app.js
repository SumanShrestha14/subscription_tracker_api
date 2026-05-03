import express from 'express';
import { PORT,NODE_ENV , ARCJET_ENV } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subsRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

// Express server setup
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(errorMiddleware);

if(ARCJET_ENV != "development"){
    app.use(arcjetMiddleware);
}

// routes
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subsRouter);
app.use('/api/v1/auth',authRouter);
app.get('/',(req,res)=>{
    res.send('Welcome to Subscription Tracker API');
})

// listening on port
app.listen(PORT,async ()=>{
    console.log(`Subscription tracker API is running on port ${PORT} in ${NODE_ENV} mode http://localhost:${PORT}`);
    await connectDB();
})

export default app;