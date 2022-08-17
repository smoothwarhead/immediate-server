const cors = require('cors');

const corsOptions = {
    origin: "https://immediate.netlify.app",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}

module.exports = cors(corsOptions);