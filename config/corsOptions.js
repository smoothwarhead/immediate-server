const allowedOrigins = require('./allowedOrigins');

const corsOptionsDelegate = (req, callback) => {

    let corsOptions;
    
    if(allowedOrigins.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true}
    }else{
        corsOptions = { origin: false}

    }
    callback(null, corsOptions)
    
}
module.exports = corsOptionsDelegate;