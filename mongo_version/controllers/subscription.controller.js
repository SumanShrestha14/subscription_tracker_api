import { SERVER_URL } from "../config/env.js";
import { workFlowClientInstance } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workFlowClientInstance.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscriptions/reminders`,
      body: JSON.stringify({
        subscriptionId: subscription._id.toString(),
      }),
      headers: {
        "content-type": "application/json",
      },
      retries: 3,
    });

    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

const getUserSubscription = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSubscriptions = async (req, res, next) => {
  try {
    const allSubscription = await Subscription.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: allSubscription,
    });
  } catch (error) {
    next(error);
  }
};
const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  createSubscription,
  getUserSubscription,
  getAllSubscriptions,
  getSubscriptionById,
};
