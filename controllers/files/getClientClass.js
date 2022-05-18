const db = require('../../database/dbConfig');
const { splitClass } = require('./splitClass');




exports.getClientClass = (userId, res, next) => {

    try {

        const getClientId = "SELECT client_id FROM client WHERE user_id = ?";

        db.query(getClientId, [userId], (err, result) => {
            if(err){
                console.log(err)
            }
            if(result){

                const clientId = result[0].client_id;
                


                query2 = "SELECT firstName, lastName, type, level, format, frequency, start_time, end_time, start_date\
                            \FROM client cl INNER JOIN class_client cc ON cl.client_id = cc.client_id INNER JOIN schedule s ON cc.class_id = s.class_id\
                            \INNER JOIN class c ON s.class_id = c.class_id INNER JOIN trainer t ON c.trainer_id = t.trainer_id INNER JOIN user u\
                            \ON t.user_id = u.user_id WHERE cl.client_id = ?";



                db.query(query2, [clientId], (err, result2) => {
                    if(err){
                        res.status(401).json({
                            classes: [],
                            logIn: true,
                            message: "No class to display at this time"
                        });
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
        })
        
    } catch (error) {
        console.log(error);
    }
}