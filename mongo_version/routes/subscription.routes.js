import { Router } from "express";
import subscription from "../controllers/subscription.controller.js";
import authorize from './../middlewares/auth.middleware.js';

const subsRouter = Router();

subsRouter.get('/' , ()=>{
    res.send({message : "GET all subscriptions"})
})
subsRouter.get('/:id' , ()=>{
    res.send({message : "GET subs by ID"})
})
subsRouter.post('/', authorize ,subscription.createSubscription)
subsRouter.put('/:id' , ()=>{
    res.send({message : "UPDATE subscription by ID"})
})
subsRouter.delete('/:id' , ()=>{
    res.send({message : "DELETE subscription by ID"})
})
subsRouter.get('/user/:id' , ()=>{
    res.send({message : "GET users subscriptions"})
})
subsRouter.get('/:id/cancel' , ()=>{
    res.send({message : "GET subscription cancellation status"})
})
subsRouter.get('/upcoming-renewals' , ()=>{
    res.send({message : "GET upcoming subscription renewals"})
})

export default subsRouter;
