import { createRequire } from 'module'
import Subscription from '../models/subscription.model.js'
import dayjs from 'dayjs'

const require = createRequire(import.meta.url)
const { serve } = require('@upstash/workflow/express')

const REMINDERS_DAYS_BEFORE = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscription_Id } = context.requestPayload ?? {}

    if (!subscription_Id) {
        console.warn("Missing subscription_Id in workflow payload")
        return;
    }

    const subscription = await fetchSubscription(context, subscription_Id)

    if (!subscription) {
        console.warn(`Subscription ${subscription_Id} not found`)
        return;
    }

    if (subscription.status !== 'active') {
        console.log(`Subscription ${subscription_Id} is not active (status: ${subscription.status}). Stopping.`)
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for ${subscription_Id}. Stopping workflow.`)
        return;
    }

    for (const daysBefore of REMINDERS_DAYS_BEFORE) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
            await triggerReminder(context, `Reminder ${daysBefore} days before`, subscription); // ✅ moved inside the if-block
        } else {
            console.log(`Skipping ${daysBefore}-day reminder — date has already passed.`)
        }
    }
})

const fetchSubscription = async (context, subscription_Id) => {
    return await context.run('get subscription',async () =>
        Subscription.findById(subscription_Id).populate('user', 'name email')
    )
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until "${label}" at ${date.toISOString()}`)
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, () => {
        console.log(`Triggering "${label}" for subscription ${subscription._id}`)
        // TODO: send email/SMS/push notification using subscription.user.email, etc.
    });
}

export default sendReminders;