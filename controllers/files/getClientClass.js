const db = require('../../database/database');
const createError = require('http-errors');
const { splitClass } = require('./splitClass');




exports.getClientClass = (userId, res, next) => {

    try {

        const getClientId = "SELECT client_id FROM client WHERE user_id = ?";

        db.query(getClientId, [userId], (err, result) => {
            if(err){
                next(createError("Internal server error"));
                return;
            }
            if(result.length === 0){
                return res.status(204).json({
                    classes: [],
                    logIn: true
                });

            }
            if(result.length > 0){

                const clientId = result[0].client_id;
                


                const getClassesQuery = "SELECT firstName, lastName, type, level, format, frequency, start_time, end_time, start_date\
                            \FROM client cl INNER JOIN class_client cc ON cl.client_id = cc.client_id INNER JOIN schedule s ON cc.class_id = s.class_id\
                            \INNER JOIN class c ON s.class_id = c.class_id INNER JOIN trainer t ON c.trainer_id = t.trainer_id INNER JOIN user u\
                            \ON t.user_id = u.user_id WHERE cl.client_id = ?";



                db.query(getClassesQuery, [clientId], (err, result2) => {
                    if(err){

                        next(createError("Internal server error"));
                        return;
                       
                    }
                    if(result2.length === 0){
                        return res.status(204).json({
                            classes: [],
                            logIn: true
                        });
                    }
                    if(result2.length > 0){


                        const classes = splitClass(result2);


                        return res.status(200).json({
                            classes: classes,
                            logIn: true
                            
                        });


                    }

                })

            }
        })
        
    } catch (error) {
        next(createError("Internal server error"));
    }
}