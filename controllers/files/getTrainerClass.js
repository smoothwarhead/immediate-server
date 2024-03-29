const db = require('../../database/database');
const createError = require('http-errors');
const fileUpload = require('express-fileupload');
const { splitClass } = require('./splitClass');


exports.getTrainerClass = (userId, res, next) =>{

    try {

        const getTrainerId = "SELECT trainer_id FROM trainer WHERE user_id = ?";

        db.query(getTrainerId, [userId], (err, result) => {
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

                const trainerId = result[0].trainer_id;


                const getClassesQuery1 = "SELECT c.class_id AS classId, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.name) AS equipments\
                        \FROM class c INNER JOIN schedule s ON c.class_id = s.class_id INNER JOIN equipment e ON s.class_id = e.class_id WHERE c.trainer_id = ? GROUP BY c.date_created";
    
                const getClassesQuery2 = "SELECT c.class_id AS classId, type, level, format, description, start_time, end_time, start_date, frequency\
                                            \FROM class c INNER JOIN schedule s ON c.class_id = s.class_id WHERE c.trainer_id = ? GROUP BY c.date_created";
                
    
    
    
                db.query(getClassesQuery1, [trainerId], (err, result2) => {
                    if(err){
                        next(createError("Internal server error"));
                        return;
                    }
                    if(result2.length === 0){

                        db.query(getClassesQuery2, [trainerId], (err, result3) => {
                            if(err){
                                next(createError("Internal server error"));
                                return;
                            }
                            if (result3.length === 0){
                                return res.status(204).json({
                                    classes: [],
                                    logIn: true
                                });
                            }

                            if (result3.length > 0){
                                const classes = splitClass(result3);


                                return res.status(200).json({
                                    classes: classes,
                                    logIn: true
                                });
                            }

                        })
                        
                        
                        
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
            
        });
        
    } catch (error) {
        next(createError("Internal server error"));
    }

   

}