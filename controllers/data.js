const db = require('../database/database');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { getClientClass } = require('./files/getClientClass');
const { getTrainerClass } = require('./files/getTrainerClass');



exports.createTrainerProfile = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                    
                        message: "Please log in to your account"
                    });
                }else{
    
                    const userId = decodedToken.id;
                        
                    const uploadFolder = `C:\\Users\\simeo\\OneDrive\\Desktop\\Deploy\\client\\public\\uploads`;
                    const file = req.files.file;
                    const fileName = file.name;
    
                    
    
    
                    const { aboutMe, gender, yearOfExp, areaOfSpec } = req.body;
    
                    const items = JSON.parse(areaOfSpec);
    
    
                    try {
    
    
                        if(req.files === null){
                            return res.status(400).json({message: "No file uploaded"});
                        }
                        else{            
                
                            
                            const query = 'INSERT INTO trainer (image, gender, years_of_exp, about_me, user_id) VALUES(?)';
                    
                                    
                            let values = [fileName, gender, yearOfExp, aboutMe, userId];
        
                            
                            db.query(query,[values], (err, result) => {
                            
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                    
                                }
                        
                                if(result){
                                
                                    trainerId = result.insertId
    
                                    //handle file upload
                                    file.mv(`${uploadFolder}/${fileName}`, err => {
                                        if(err){
                                            next(createError("The file could not be uploaded. Please make sure the file format is correct"));                                            
                                            return;

                                        }
                        
                                    });
    
                                    const query2 = "INSERT INTO specialization (specialization_name, trainer_id, user_id) VALUES ?";
    
                                    
                                    db.query(query2, [items.map(item => [item.item, trainerId, userId])], (err, result2) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;

                                        }
                                                                               
    
                                        return res.status(201).json({
                                            logIn: true,
                                            message: "Profile successfully created"
                                        });
                                        
                                    }); 
                                    
    
    
    
                                    
                                }
                                else{
                                    return res.status(204);
                                    
                                }
                        
                            
                        
                            }); 
                    
                        
    
           
                        }
                        
                        
                    } catch (error) {
                
                        next(createError("Internal server error"));

                        
                    }
    
    
                   
    
                }
            })
        }
        
    } catch (error) {
        next(createError("Internal server error"));
        
    }
   

}



exports.createClientProfile = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                const userId = decodedToken.id;
                console.log(userId);
           
                const uploadFolder = `C:\\Users\\simeo\\OneDrive\\Desktop\\Deploy\\client\\public\\uploads`;
                const file = req.files.file;
                const fileName = file.name;

                


                const { age, gender, height, weight, fitness_goals } = req.body;

                const items = JSON.parse(fitness_goals);


                try {


                    if(req.files === null){
                        return res.status(400).json({message: "No file uploaded"});
                    }
                    else{        
            
                        
                        const query = 'INSERT INTO client (image, gender, age_range, height, weight, user_id) VALUES(?)';
                
                                
                        let values = [fileName, gender, age, height, weight, userId];
    
                        //const latestId = '';
                        db.query(query,[values], (err, result) => {
                        
                            if(err){
                                next(createError("Internal server error"));
                                return;
                            }
                    
                            if(result){
                            
                                clientId = result.insertId

                                //handle file upload
                                file.mv(`${uploadFolder}/${fileName}`, err => {
                                    if(err){
                                        next(createError("The file could not be uploaded. Please make sure the file format is correct"));                                            
                                        return;
                                    }
                    
                                });

                                const query2 = "INSERT INTO fitness_goal (goal, client_id, user_id) VALUES ?";

                                
                                db.query(query2, [items.map(item => [item.item, clientId, userId])], (err, result2) => {
                                    if(err){
                                        next(createError("Internal server error"));
                                        return;
                                    }
                                                                        

                                    return res.status(201).json({
                                        logIn: true,
                                        message: "Profile successfully created"
                                    })
                                }); 
                                



                                
                            }
                            else{
                                return res.status(404).json({message: "No profile was created"})
                            }
                    
                        
                    
                        }); 
                
                    

       
                    }
                    
                    
                } catch (error) {
                    next(createError("Internal server error"));
                    
                }


               

            }
        })
    }

};



exports.createClass = (req, res, next) => {

    
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                try {

                    const userId = decodedToken.id;
                    const { levels, formats, types, description, startDate, startTime, endTime, equipments, frequency } = req.body;

                    const getTrainerId = "SELECT trainer_id FROM trainer WHERE user_id = ?";
                    const query1 = "INSERT INTO class (type, level, format, description, trainer_id, user_id) VALUES (?)";
                    const query2 = "INSERT INTO schedule (start_time, end_time, start_date, frequency, class_id) VALUES (?)";
                    const query3 = "INSERT INTO equipment (name, class_id, trainer_id, user_id) VALUES ?";
    
                    let classId;
                    let trainerId;
    
                    const values = [types, levels, formats, description, userId];

                    db.query(getTrainerId, [userId], (err, result) => {

                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result){
                            trainerId = result[0].trainer_id;

                            let classValues = [ types, levels, formats, description,trainerId, userId];


                            db.query(query1, [classValues], (err, result1) => {

                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result1){
                                    classId = result1.insertId;

                                    let scheduleValues = [ startTime, endTime, startDate, frequency, classId ];


                                    db.query(query2, [scheduleValues], (err, result2) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result2){

                                            db.query(query3, [equipments.map(equipment => [equipment.item, classId, trainerId, userId])], (err, result3) => {

                                                if(err){
                                                    next(createError("Internal server error"));
                                                    return;
                                                }
                                                if(result3){
                                                    return res.status(201).json({
                                                        logIn: true,
                                                        message: "Class successfully created"
                                                    })
                                                }
                                            })

                                        }
                                    });


                                }
                            })
                            
                        }
                    });
                    
                } catch (error) {
                    next(createError("Internal server error"));
                    
                }

                

            }
        })

    }
    
  
};


exports.addClass = (req, res, next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                const userId = decodedToken.id;
                const getClientQuery = "SELECT client_id FROM client WHERE user_id = ?";

                try {

                    
                    db.query(getClientQuery, [userId], (err, result) => {

                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
    
                        if(result){
    
                            clientId = result[0].client_id;
    
                            const {classId, trainerId} = req.body;
    
                            const classInsertQuery = "INSERT INTO class_client (class_id, trainer_id, client_id) VALUES (?)";

                            const insertValues = [classId, trainerId, clientId]
    
                            db.query(classInsertQuery, [insertValues], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2){
                                    return res.status(201).json({
                                        logIn: true,
                                        message: "New class successfully added"
                                    })
                                }
                            })
    
                        }
    
                    })
                    
                } 
                catch (error) {
                    next(createError("Internal server error"));
                
                }

               

                

            }
        })
    }       // const allEquip
}



exports.trainerClasses = (req, res, next) => {

    const token = req.cookies.jwt;
    

    // check jwt exists and is verified
    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                try {

                    const userId = decodedToken.id;
                    getTrainerClass(userId, res, next);
                    
                } catch (error) {
                    next(createError("Internal server error"));
                    
                }

                

            }
               
                   
        });
    }
    else{
        return res.status(401).json({
            user: [],            
            message: "Please log in to your account"
        });
   }


}


exports.clientClasses = (req, res, next) => {

    const token = req.cookies.jwt;
    

    // check jwt exists and is verified
    if(token){
        jwt.verify(token, 'fitness secret', (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                try {

                    const userId = decodedToken.id;
                    getClientClass(userId, res, next);
                    
                    
                    
                } catch (error) {
                    next(createError("Internal server error"));
                    
                }

                

                  

               

            }
        })
    }
    else{
        return res.status(401).json({
            user: [],            
            message: "Please log in to your account"
        });
   }


}

exports.dashboard = (req, res, next) => {

    const token = req.cookies.jwt;

    const userRole = req.params.id;

    if(token){

        jwt.verify(token, 'fitness secret', (err, decodedToken) => {

            if(err){
                return res.status(401).json({
                    user: [],
                    message: "Please log in to your account"
                });
            }
            else{

                const userId = decodedToken.id;

                try {

                    if(userRole.toLowerCase() === 'trainer'){
                        getTrainerClass(userId, res, next);
                    }
                    if(userRole.toLowerCase() === 'client'){
                        
                        getClientClass(userId, res, next);
                    }
                    
                } catch (error) {
                    next(createError("Internal server error"));
                }

               


            }
        })
    }
    else{
        res.status(401).json({
            user: [],
            message: "Please log in to your account"
        });
   }

}


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
                        if(result){
    
                            trainerId = result[0].trainer_id;
    
                            const queryProfile = "SELECT t.image AS profileImage, firstName, lastName, city, state, about_me, gender, COUNT(DISTINCT (cc.client_id)) AS numberOfEntities, GROUP_CONCAT(DISTINCT type) as classes, rating, GROUP_CONCAT(DISTINCT specialization_name) AS specializations, COUNT(DISTINCT (c.class_id)) as numberOfClasses\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN specialization s ON t.trainer_id = s.trainer_id INNER JOIN class c ON s.trainer_id = c.trainer_id INNER JOIN class_client cc ON c.class_id = cc.class_id\
                                                    \WHERE t.trainer_id = ? GROUP BY firstName";
    
    
                            const trainerProfile = "SELECT image, firstName, lastName, city, state, about_me, gender, GROUP_CONCAT(DISTINCT type) as classes, rating, GROUP_CONCAT(DISTINCT specialization_name) AS specializations\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN class c ON t.trainer_id = c.trainer_id INNER JOIN specialization s ON c.trainer_id = s.trainer_id\
                                                    \WHERE t.trainer_id = ? GROUP BY firstName";
    
    
    
                            db.query(queryProfile, [trainerId], async (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){
    
                                    const numOfRoles = 0;
    
                                    db.query(trainerProfile,[trainerId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result3){
                                            return res.status(200).json({
                                                profile: {...result3[0], numOfEntities: numOfRoles},
                                                logIn: true
                                            });
                                        }
                                        
                                    })
                                }
                                else{
                                    return res.status(200).json({
                                        profile: result2[0],
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



exports.getClientProfile = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                        
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
                        if(result){
    
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
    
                                    const numOfClasses = 0;
                                    const numOfTrainers = 0;
                                    const rating = "";
    
                                    db.query(clientProfile,[clientId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result3){
    
                                            return res.status(200).json({
                                                profile: {...result3[0], classes: [], numberOfClasses: numOfClasses, numberOfEntities: numOfTrainers, rating: rating},                                    
                                                logIn: true
                                            });

                                        }
                                    })
                                }
                                else{
                                    return res.status(200).json({
                                        profile: result2[0],
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
                logIn: false,
                message: "Please log in to your account"
            });
            
       }

        
    } catch (error) {
        next(createError("Internal server error"));
    }


    // check jwt exists and is verified
   


}



exports.getClient = (req, res, next) => {

    try {

        
        const token = req.cookies.jwt;
        let trainerId;

         // check jwt exists and is verified
        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],
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
                        if(result){

                            trainerId = result[0].trainer_id;

                            const queryClient = "SELECT firstName, lastName, cl.image AS image, city, state, group_concat(DISTINCT goal) as goals, c.format FROM user u\
                                                \INNER JOIN client cl ON u.user_id = cl.user_id INNER JOIN fitness_goal f ON cl.client_id = f.client_id INNER JOIN class_client s\
                                                \ON f.client_id = s.client_id INNER JOIN class c ON s.class_id = c.class_id INNER JOIN trainer t ON c.trainer_id = t.trainer_id\
                                                \WHERE t.trainer_id = ? GROUP BY firstName;"
                                    



                            db.query(queryClient, [trainerId],  (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){

                                    return res.status(200).json({
                                        clients: [],
                                        logIn: true
                                    });
                                    
                                }
                                else{
                                    return res.status(200).json({
                                        clients: result2,
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



}



exports.getTrainer = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        // check jwt exists and is verified
        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                        
                        message: "Please log in to your account"
                    });
                }else{
    
                    const getTrainer = "SELECT firstName, lastName, image, rating, city, state, GROUP_CONCAT(DISTINCT specialization_name) AS specializations FROM user u\
                                        \JOIN trainer t ON u.user_id = t.user_id JOIN specialization s ON t.trainer_id = s.trainer_id GROUP BY firstName";
    
                     db.query(getTrainer, (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result){
                            return res.status(200).json({
                                trainers: result,
                                logIn: true
                            });
                            
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

 


};



exports.getAllClasses = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        // check jwt exists and is verified
        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                        
                        message: "Please log in to your account"
                    });
                }else{
    
                    const getAllClasses = "SELECT c.class_id AS classId, t.trainer_id AS trainerId, firstName, lastName, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.name) AS equipment_name\
                                            \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN class c ON t.trainer_id = c.trainer_id INNER JOIN schedule s ON c.class_id = s.class_id\
                                            \INNER JOIN equipment e ON s.class_id = e.class_id GROUP BY c.class_id";
    
                     db.query(getAllClasses, (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result){
    
                            return res.status(200).json({
                                classes: result,
                                logIn: true
                            });
                            
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




}


exports.getOneClass = (req, res, next) => {

    try {

        const id = req.params.id;

        const token = req.cookies.jwt;
        
        // check jwt exists and is verified
        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                        
                        message: "Please log in to your account"
                    });
                }else{
    
                    const getOneClass = "SELECT c.class_id AS classId, t.trainer_id AS trainerId, firstName, lastName, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.equipment_id) AS equipmentId, GROUP_CONCAT(e.name) AS equipmentName\
                                        \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN class c ON t.trainer_id = c.trainer_id INNER JOIN schedule s ON c.class_id = s.class_id\
                                        \INNER JOIN equipment e ON s.class_id = e.class_id WHERE c.class_id = ?";
    
                     db.query(getOneClass,[id], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result){
    
                            const equipmentIds = result[0].equipmentId.split(",");
                            const equipmentNames = result[0].equipmentName.split(",");
    
                            const equipments = [];
    
                            
                            for(let i = 0; i < equipmentIds.length; i++){
    
                                equipments.push({ id: equipmentIds[i], item: equipmentNames[i]});
    
                            };
    
                            const oneClass = {...result[0], equipments: equipments}
                           
                            
    
                            return res.status(200).json({
                                oneClass: oneClass,
                                logIn: true
                            });
                            
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
   


}


exports.editClass = (req, res, next) => {

    try {
        
        const classId = req.params.id;

        const token = req.cookies.jwt;
    
        if(token){
            jwt.verify(token, 'fitness secret', (err, decodedToken) => {
    
                if(err){
                    return res.status(401).json({
                        user: [],                        
                        message: "Please log in to your account"
                    });
                }else{

                    try {

                        const userId = decodedToken.id;
                                                                
                        const { levels, formats, types, description, startDate, startTime, endTime, items, frequency } = req.body
        
                        const updatedStartDate = new Date(startDate).toLocaleDateString();
                                        
        
                        const getTrainerId = "SELECT trainer_id FROM trainer WHERE user_id = ?";
                        const getEquipment = "SELECT equipment_id as id, name as item FROM equipment WHERE class_id = ?";
                        const query1 = "UPDATE class SET type = ?, level = ?, format = ?, description = ? WHERE class_id = ?";
                        const query2 = "UPDATE schedule SET start_time = ?, end_time = ?, start_date = ?, frequency = ? WHERE class_id =?";
                        const query3 = "UPDATE equipment SET name = ? WHERE equipment_id = ? AND class_id = ?";
        
        
                        db.query(getTrainerId, [userId], (err, response) => {
        
                            if(err){
                                next(createError("Internal server error"));
                                return;
                            }
                            if(response){
        
                                trainerId = response[0].trainer_id;
        
                                db.query(query1, [[types], [levels], [formats], [description], [classId]], (err, result) => {
        
                                    if(err){
                                        next(createError("Internal server error"));
                                        return;
                                    }
                
                                    if(result){
                
                                        db.query(query2, [[startTime], [endTime], [updatedStartDate], [frequency], [classId]], (err, result1) => {
                                            if(err){
                                                next(createError("Internal server error"));
                                                return;
                                            }
                
                                            if(result1){
                
                                                db.query(getEquipment, [classId], (err, result2) => {
                
                                                    if(err){
                                                        next(createError("Internal server error"));
                                                        return;
                                                    }
                
                                                    if(result2){
                
                
                                                        const dbEquipment = result2;
                
                                                        const equipments = items.map(item => {
                                                            return {...item, id: parseInt(item.id)}
                                                        });
                                                        
                
                                                        const putEquipment = [];
                                                        const toPostEquipment = [];                                        
                                                            
                                                            
                                                        equipments.forEach((equipment, index) => {
                
                                                            if(JSON.stringify(equipment) === JSON.stringify(dbEquipment[index])){
                                                                putEquipment.push(equipment);
                                                            }
                
                                                            else{
                                                                toPostEquipment.push(equipment);
                                                                
                                                            }
                                                            
                                                        });
                
                                                            
                                                        putEquipment.forEach(equipment => {
                                                            db.query(query3, [[equipment.item], [equipment.id], [classId]], (err, result3) => {
                                                                if(err){
                                                                    next(createError("Internal server error"));
                                                                    return;
                                                                        
                                                                }
                                                                if(result3){
                                                                    console.log(`updated ${equipment.item}`);
                                                                }
                                                            })
                                                        });
                
                                                        if(toPostEquipment.length === 0){
                                                            return res.status(201).json({
                                                                logIn: true,
                                                                message: "Class successfully updated"
                                                            });
                                                            
                                                        }
                                                        else{
                
                                                            const insertEquipment = "INSERT INTO equipment (name, class_id, trainer_id, user_id) VALUES (?)";
                                                            console.log(toPostEquipment);
                
                                                            db.query(insertEquipment, toPostEquipment.map(equipment => [equipment.item, classId, trainerId, userId]), (err, result4) => {
                    
                                                                if(err){
                                                                    next(createError("Internal server error"));
                                                                    return;
                                                                }
                    
                                                                if(result4){
                                                                    return res.status(201).json({
                                                                        logIn: true,
                                                                        message: "Class successfully updated"
                                                                    });
                                                                
                    
                                                                }
                                                            });
        
                                                        }
                
                                                    }
                
                                                });
                
                                            }
                
                                        });
                                    }
                                });
        
        
                            }
        
                        });
                        
                    } catch (error) {

                        next(createError("Internal server error"));                
                        
                    }  
                    
    
    
                }
            });
        }

    } catch (error) {
        next(createError("Internal server error"));
    }
    
   

}


