import { config } from "dotenv";

const env = process.env.NODE_ENV || "development";
config({ path: `.env.${env}.local` });

export const {
     PORT,
     NODE_ENV,
     DB_URI,
     JWT_SECRET,
     JWT_EXPIRES_IN,
     ARCJET_KEY,
     ARCJET_ENV,
     QSTASH_URL,
     QSTASH_TOKEN,
     SERVER_URL
     } = process.env;
