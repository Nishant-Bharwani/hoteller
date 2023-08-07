// Server details
exports.HOST = process.env.NODE_ENV === 'production' ? process.env.HOST_PROD : process.env.HOST_DEV
exports.BASE_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL_PROD : process.env.BASE_URL_DEV;
exports.APP_SERVICE_URL = process.env.NODE_ENV === 'production' ? process.env.APP_SERVICE_URL : process.env.CLIENT_URL;

// MongoDB URL
exports.DB_URL = process.env.DB_URL

// JWT secrets
exports.JWT_ACCESS_TOKEN_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
exports.JWT_REFRESH_TOKEN_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
exports.JWT_TOKEN_COOKIE_EXPIRES = process.env.JWT_TOKEN_COOKIE_EXPIRES;

// Nodemailer secrets
exports.NODEMAILER_EMAIL_ADDRESS = process.env.NODEMAILER_EMAIL_ADDRESS;
exports.NODEMAILER_APP_GENERATED_PASSWORD = process.env.NODEMAILER_APP_GENERATED_PASSWORD;

// Stripe secrets
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;