require('dotenv').config();
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: "greenietec",
    api_key: "184763843515448",
    api_secret: "npKY_g1ejcUeP3SW2xK7qZHRBxI",


    // cloud_name: process.env.CLOUDINARY_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
});


module.exports = { cloudinary };
