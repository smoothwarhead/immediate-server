const db = require('../../database/dbConfig');
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
            if(result){
    
                const trainerId = result[0].trainer_id;
    
                query2 = "SELECT c.class_id AS classId, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.name) AS equipments\
                        \FROM class c INNER JOIN schedule s ON c.class_id = s.class_id INNER JOIN equipment e ON s.class_id = e.class_id WHERE c.trainer_id = ? GROUP BY c.date_created";
    
    
    
                db.query(query2, [trainerId], (err, result2) => {
                    if(err){
                        next(createError("Internal server error"));
                        return;
                    }
                    if(result2.length === 0){
                        res.status(401).json({
                            classes: [],
                            logIn: true,
                            message: "There is no class created yet"
                        });
                    }
                    else{
                       
                        const classes = splitClass(result2);
                        
                        res.status(200).json({
                            classes: classes,
                            logIn: true
                        });
    
                        next();
                    }
                })
    
            }
        });
        
    } catch (error) {
        next(createError("Internal server error"));
    }

   

}