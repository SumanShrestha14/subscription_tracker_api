import { createRequire } from 'module'
import Subscription from '../models/subscription.model.js'
import dayjs from 'dayjs'
import { sendReminderEmail } from '../services/email.service.js'

const require = createRequire(import.meta.url)
const { serve } = require('@upstash/workflow/express')

const REMINDERS_DAYS_BEFORE = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId, subscription_Id } = context.requestPayload ?? {}
    const effectiveSubscriptionId = subscriptionId || subscription_Id

    if (!effectiveSubscriptionId) {
        throw new Error('Missing subscription_Id in workflow payload')
    }

    const subscription = await fetchSubscription(context, effectiveSubscriptionId)

    if (!subscription) {
        throw new Error(`Subscription ${effectiveSubscriptionId} not found`)
    }

    if (subscription.status !== 'active') {
        console.log(`Subscription ${effectiveSubscriptionId} is not active (status: ${subscription.status}). Stopping.`)
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for ${effectiveSubscriptionId}. Stopping workflow.`)
        return;
    }

    for (const daysBefore of REMINDERS_DAYS_BEFORE) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isBefore(dayjs())) {
            console.log(`Skipping ${daysBefore}-day reminder — date has already passed.`)
            continue;
        }

        await sleepUntilReminder(context, `${daysBefore}-day reminder`, reminderDate);
        await triggerReminder(context, `${daysBefore}-day reminder`, subscription, daysBefore);
    }
})

const fetchSubscription = async (context, subscription_Id) => {
    return await context.run('fetch subscription',async () =>
        Subscription.findById(subscription_Id).populate('user', 'name email')
    )
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until "${label}" at ${date.toISOString()}`)
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription, daysBefore) => {
    return await context.run(label, async() => {
        console.log(`Triggering "${label}" for subscription ${subscription._id}`)
        await sendReminderEmail({
            to: subscription.user.email,
            daysBefore,
            subscription,
        })
    });
}

export default sendReminders;