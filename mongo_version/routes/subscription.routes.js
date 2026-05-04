import { Router } from "express";
import subscription from "../controllers/subscription.controller.js";
import authorize from './../middlewares/auth.middleware.js';

const subsRouter = Router();

subsRouter.get('/' ,authorize , subscription.getAllSubscriptions)
subsRouter.get('/:id' ,authorize , subscription.getSubscriptionById)
subsRouter.post('/', authorize ,subscription.createSubscription)
// subsRouter.put('/:id' , ()=>{
//     res.send({message : "UPDATE subscription by ID"})
// })
// subsRouter.delete('/:id' , ()=>{
//     res.send({message : "DELETE subscription by ID"})
// })
subsRouter.get('/user/:id' , authorize, subscription.getUserSubscription)
subsRouter.get('/:id/cancel' , ()=>{
    res.send({message : "GET subscription cancellation status"})
})
subsRouter.get('/upcoming-renewals' , ()=>{
    res.send({message : "GET upcoming subscription renewals"})
})

export default subsRouter;
