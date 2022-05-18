const express = require("express");
const app = express();
const createError = require("http-errors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
let PORT = process.env.PORT || 5000;

const allRoutes = require('./routes/allRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(logger('dev'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


app.use(allRoutes);
app.use(authRoutes);













app.use( function(req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.status(204);
    }
  
    return next();
  
});



//404 handler and pass to error handler
app.use((req, res, next) => {
    next(createError(404, "Not found"));
});


//generic error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});