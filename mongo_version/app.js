import express from 'express';
import { PORT,NODE_ENV , ARCJET_ENV } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subsRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

// Express server setup
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

if(ARCJET_ENV != "development"){
    app.use(arcjetMiddleware);
}

// routes
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subsRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/workflows',workflowRouter)
app.get('/',(req,res)=>{
    res.send('Welcome to Subscription Tracker API');
})

app.use(errorMiddleware);

// listening on port
const startServer = async ()=>{
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Subscription tracker API is running on port ${PORT} in ${NODE_ENV} mode http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}

startServer();

export default app;