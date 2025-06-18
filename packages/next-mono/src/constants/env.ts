export const env = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  FLASK_APP_URL: process.env.NEXT_PUBLIC_FLASK_APP_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
} as const;
