const db = require('../../database/database');
// const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { splitItems } = require('../files/splitItems');
const createError = require("http-errors");



exports.getTrainerProfile = (req, res, next) => {

    try {

        const token = req.cookies.jwt;
        let trainerId;

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
                       
                    const getTrainerId = "SELECT trainer_id FROM trainer WHERE user_id = ?";
    
                     db.query(getTrainerId, [userId], (err, result) => {
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
    
                            trainerId = result[0].trainer_id;

                            const getTrainerRating = (rating, ratingNum) => {

                                if(rating === 0 || ratingNum === 0 ){
                                    return 0;
                                }
                                else{
                                    return rating/ratingNum;

                                }
                            }

                           
                            const queryProfile1 = "SELECT t.image_url AS profileImage, t.image_id AS publicId, firstName, lastName, city, state, about_me, gender, COUNT(DISTINCT (cc.client_id)) AS numberOfEntities, GROUP_CONCAT(DISTINCT type) as classes, rating, number_of_rating AS ratingNum, GROUP_CONCAT(DISTINCT specialization_name) AS specializations, COUNT(DISTINCT (c.class_id)) as numberOfClasses\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN specialization s ON t.trainer_id = s.trainer_id INNER JOIN class c ON s.trainer_id = c.trainer_id INNER JOIN class_client cc ON c.class_id = cc.class_id\
                                                    \WHERE t.trainer_id = ? GROUP BY firstName";

                            const queryProfile2 = "SELECT t.image_url AS profileImage, t.image_id AS publicId, firstName, lastName, city, state, about_me, gender, GROUP_CONCAT(DISTINCT c.type) as classes, rating, number_of_rating AS ratingNum, GROUP_CONCAT(DISTINCT specialization_name) AS specializations, COUNT(DISTINCT (c.class_id)) as numberOfClasses\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN specialization s ON t.trainer_id = s.trainer_id INNER JOIN class c ON s.trainer_id = c.trainer_id WHERE t.trainer_id = ? GROUP BY firstName";
    
    
                                                    //

                            const queryProfile3 = "SELECT t.image_url AS profileImage, t.image_id AS publicId, firstName, lastName, city, state, about_me, gender, GROUP_CONCAT(DISTINCT specialization_name) AS specializations\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN specialization s ON t.trainer_id = s.trainer_id\
                                                    \WHERE t.trainer_id = ? GROUP BY firstName";
    
    
    
                            db.query(queryProfile1, [trainerId], async (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){
    
                                    const numberOfEntities = 0;
                                    const numberOfClasses = 0;
                                    
                                    db.query(queryProfile2,[trainerId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }

                                        if(result3.length === 0){


                                            db.query(queryProfile3, [trainerId], (err, result4) => {

                                                if(err){
                                                    next(createError("Internal server error"));
                                                    return;
                                                }

                                                if(result4){
                                                    let classes = [];

                                                    // const trainerRating = getTrainerRating(result3[0].rating, result3[0].ratingNum);
                                                    const trainerRating = 0;


                                                    const specializations = splitItems(result4[0].specializations);
                                                    
                                                    let profile = {...result4[0], specializations, numberOfEntities, numberOfClasses, trainerRating, classes};
        
                                                    return res.status(200).json({
                                                        profile: [profile],
                                                        logIn: true
                                                    });
                                                }

                                               

                                            })

                            
                                        }
                                        else{

                                            const specializations = splitItems(result3[0].specializations);
                                            let classes = splitItems(result3[0].classes);
                                            const trainerRating = getTrainerRating(result3[0].rating, result3[0].ratingNum);

                                            
                                            let profile = {...result3[0], specializations, numberOfEntities, classes, trainerRating};

                                            return res.status(200).json({
                                                profile: [profile],
                                                logIn: true
                                            });
                                        }
                                        
                                    })
                                }
                                else{
                                    const specializations = splitItems(result2[0].specializations);
                                    const classes = splitItems(result2[0].classes);
                                    const trainerRating = getTrainerRating(result2[0].rating, result2[0].ratingNum);
                                    

                                    let profile = {...result2[0], specializations, classes, trainerRating};

                                    


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