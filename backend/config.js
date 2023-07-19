// Server details
exports.HOST = process.env.HOST;
exports.BASE_URL = process.env.BASE_URL;

// MongoDB URL
exports.DB_URL = process.env.DB_URL

// JWT Secrets
exports.JWT_ACCESS_TOKEN_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
exports.JWT_REFRESH_TOKEN_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
exports.JWT_TOKEN_COOKIE_EXPIRES = process.env.JWT_TOKEN_COOKIE_EXPIRES;