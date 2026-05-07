import nodemailer from 'nodemailer';
import {
    EMAIL_FROM,
    EMAIL_PASSWORD,
    EMAIL_SERVICE,
    EMAIL_USER,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
} from './env.js';

export const accountEmail = EMAIL_FROM || EMAIL_USER || 'no-reply@example.com';

const transporter = nodemailer.createTransport(
    SMTP_HOST
        ? {
            host: SMTP_HOST,
            port: Number(SMTP_PORT || 587),
            secure: SMTP_SECURE === 'true',
            auth: EMAIL_USER && EMAIL_PASSWORD
                ? {
                    user: EMAIL_USER,
                    pass: EMAIL_PASSWORD,
                }
                : undefined,
        }
        : {
            service: EMAIL_SERVICE || 'gmail',
            auth: EMAIL_USER && EMAIL_PASSWORD
                ? {
                    user: EMAIL_USER,
                    pass: EMAIL_PASSWORD,
                }
                : undefined,
        },
);

export default transporter;