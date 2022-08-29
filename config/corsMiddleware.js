const cors = require('cors');

const corsOptions = {
    origin: "https://immediate.netlify.app",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested"],
    preflightContinue: true,
    credentials: true
}

module.exports = cors(corsOptions);