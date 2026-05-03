import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: [true, "Subscription name is required"],
        trim : true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"]
    },
    price:
    {
        type: Number,
        required: [true, "Price is required"],
        minlength: [0, "Price must be a positive number"],
    },
    currency:
    {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD","NPR", "INR", "PKR", "BDT", "LKR", "AFN", "MVR", "MMK", "KHR", "LAK", "BTN"],
        default: "NPR",
    },
    frequency:
    {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category:
    {
        type: String,
        enum: ["entertainment", "education", "health", "fitness", "productivity", "finance", "news", "social media", "gaming", "music", "video streaming", "cloud storage", "software as a service (SaaS)", "other"],
        required: [true, "Category is required"],
    },
    paymentMethod:
    {
        type: String,
        required: [true, "Payment method is required"],
        trim : true,
    },
    status:
    {
        type: String,
        enum: ["active", "expired", "canceled"],
        default: "active",
    },
    startDate:
    {
        type: Date,
        required: [true, "Start date is required"],
        validate:{
            validator : function(value){
                return value <= new Date();
            },
            message: "Start date cannot be in the future"
        }
    },
    renewalDate:
    {
        type: Date,
        validate:{
            validator : function(value){
                return value >= this.startDate;
            },
            message: "Renewal date cannot be before start date"
        }
    },
    user:
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: [true, "User is required"],
        index: true
    }


},{timestamps:true});

// auto calculate renewal date if missing 
subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }
        // jan 1st 
        // monthly -> jan 31st

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        // return next(new Error("Renewal date cannot be before start date"));
        this.status = "expired";
    }

    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;