const db = require('../../database/database');
// const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { splitItems } = require('../files/splitItems');



exports.getClientProfile = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],  
                        logIn: false,
                        message: "Please log in to your account"
                    });
                }else{
    
                    const userId = decodedToken.id;
    
                    const getClientId = "SELECT client_id FROM client WHERE user_id = ?";
    
                     db.query(getClientId, [userId], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result.length === 0){
                            return res.status(204).json({
                                profile: [],
                                logIn: true
                            });
                        }

                        if(result.length > 0){
    
                            clientId = result[0].client_id;
    
                            const queryProfile = "SELECT u.firstName AS firstName, u.lastName AS lastName, c.image AS profileImage, u.city AS city, u.state AS state, COUNT(DISTINCT (t.trainer_id)) AS numberOfEntities, GROUP_CONCAT(DISTINCT type) as classes, height, weight, GROUP_CONCAT(DISTINCT goal) AS goals, COUNT(DISTINCT (cs.class_id)) AS numberOfClasses\
                                                    \FROM user u INNER JOIN client c ON u.user_id = c.user_id INNER JOIN fitness_goal f ON c.client_id = f.client_id INNER JOIN class_client cl ON f.client_id = cl.client_id\
                                                    \INNER JOIN class cs ON cl.class_id = cs.class_id INNER JOIN trainer t ON cs.trainer_id = t.trainer_id WHERE c.client_id = ? GROUP BY firstName";
    
    
                            const clientProfile = "SELECT u.firstName AS firstName, u.lastName AS lastName, c.image AS profileImage, u.city AS city, u.state AS state, height, weight, GROUP_CONCAT(DISTINCT goal) AS goals\
                                                    \FROM user u INNER JOIN client c ON u.user_id = c.user_id INNER JOIN fitness_goal f ON c.client_id = f.client_id\
                                                    \WHERE c.client_id = ? GROUP BY firstName";
    
    
    
                            db.query(queryProfile, [clientId], async (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){
    
                                    const numberOfClasses = 0;
                                    const numberOfEntities = 0;
                        
                                    const classes = [];
    
                                    db.query(clientProfile,[clientId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result3){       
                                            
                                            const goals = splitItems(result3[0].goals);
                                            
                                            let profile = {...result3[0], goals, numberOfEntities, numberOfClasses, classes};

    
                                            return res.status(200).json({
                                                profile: [profile],                               
                                                logIn: true
                                            });

                                        }
                                    })
                                }
                                else{

                                    const goals = splitItems(result2[0].goals);
                                    const classes = splitItems(result2[0].classes);

                                    let profile = {...result2[0], goals, classes};

                                    return res.status(200).json({
                                        profile: [profile],
                                        logIn: true
                                    });
                                    
                                }
                            })
    
                        }
                    })
    
    
                }
            })
        }
        else{
            return res.status(401).json({
                user: [],
                message: "Please log in to your account"
            });
            
       }

        
    } catch (error) {
        next(createError("Internal server error"));
    }


    // check jwt exists and is verified
   


}