const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jwt exists and is verified
    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                res.status(401).json({
                    user: [],
                    message: "Please log in to your account"
                });
            }else{
                next();
            }
        })
    }
    else{
        res.status(401).json({
            user: [],
            message: "Please log in to your account"
        });
    }
};


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jwt exists and is verified
    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                res.status(401).json({
                    user: [],
                    logIn: false,
                    message: "Please log in to your account"
                });
            }else{

                const userId = decodedToken.id;
                
                query = 'SELECT * FROM user WHERE user_id = ?';

                db.query(query, [userId], (err, result) => {
                    if(err){
                        res.status(401).json({
                            user: [],
                            logIn: false,
                            message: "Please log in to your account"
                        });
                        next();
                    }
                    if(result.length === 0){
                        res.status(401).json({
                            user: [],
                            logIn: false,
                            message: "There is no account in our database that matches these credentials"
                        });
                        next();
                    }
                    else{
                        res.status(200).json({
                            user: result,
                            logIn: true
                        });
                        next();
                    }
                })

            }
        })
    }
    else{
        res.status(401).json({
            user: [],
            logIn: false,
            message: "Please log in to your account"
        });

        next();
   }
};



module.exports = { requireAuth, checkUser };