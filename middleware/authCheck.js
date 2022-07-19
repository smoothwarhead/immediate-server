const jwt = require('jsonwebtoken');
const db = require('../database/database');
const createError = require('http-errors');


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


    try {

        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    next(createError("Internal server error"));
                    return;
            
                }else{
    
                    const userId = decodedToken.id;
                    
                    query = 'SELECT user_id AS userId, firstName, lastName, role FROM user WHERE user_id = ?';
    
                    db.query(query, [userId], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                
                        }
                        if(result.length === 0){

                            return res.status(200).json({
                                user: [],
                                logIn: false,
                            });
                            
                        }
                        if(result.length > 0){

                            const getCode = () => {

                                
                                if(result[0].role === 'Trainer'){
                                    return 3030;
                                }

                                if(result[0].role === 'Client'){                                    
                                    return 3050;
                                }

                            }

                            let user = {...result[0], allowedRole: getCode() };
                            // console.log(user);

                            
                            return res.status(200).json({
                                user: [user],
                                logIn: true
                                
                            });
                            
                        }
                    })
    
                }
            })
        }
        else{

            next(createError(401, "Please log in to your account"));
            return;
            // return res.status(401).json({
            //     user: [],
            //     message: "Please log in to your account"
            // });
       }
        
    } catch (error) {
        next(createError("Internal server error"));
        return;
        
    }

    // check jwt exists and is verified
   
};



module.exports = { requireAuth, checkUser };