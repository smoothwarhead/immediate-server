const db = require('../database/database');
const createError = require('http-errors');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { getClientClass } = require('./files/getClientClass');
const { getTrainerClass } = require('./files/getTrainerClass');
const { splitClass } = require('./files/splitClass');
const { splitItems } = require('./files/splitItems');
const { itemShuffle } = require('./files/itemShuffle');



exports.createTrainerProfile = (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'fitness secret', async (err, decodedToken) => {
                if(err){
                    return res.status(401).json({
                        user: [],                    
                        message: "Please log in to your account"
                    });
                }else{
    
                    const userId = decodedToken.id;
                        
    
                    const {fileName, fileId, aboutMe, gender, yearOfExp, areaOfSpec } = req.body;
    
                    const items = JSON.parse(areaOfSpec);
    
    
                    try {
    
    
                        if(fileName === null){
                            return res.status(400).json({message: "No file uploaded"});
                        }
                        else{   
                                     
                            const query = 'INSERT INTO trainer (image_url, image_id, gender, years_of_exp, about_me, user_id) VALUES(?)';
                    
                                    
                            let values = [fileName, fileId, gender, yearOfExp, aboutMe, userId];

                            db.query(query,[values], (err, result) => {
                        
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                    
                                }
                        
                                if(result){
                                
                                    trainerId = result.insertId
    
                                    const query2 = "INSERT INTO specialization (specialization_name, trainer_id, user_id) VALUES ?";
    
                                    
                                    db.query(query2, [items.map(item => [item.item, trainerId, userId])], (err, result2) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;

                                        }
                                                                               
                                        if(result2){
                                            return res.status(201).json({
                                                logIn: true,
                                                message: "Profile successfully created"
                                            });
                                        }
                                        
                                        
                                    }); 
                                    
    
    
    
                                    
                                }
                                else{
                                    return res.status(204).json({message: "No profile was created"});
                                    
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


exports.createClientProfile =  (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'fitness secret', async (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    user: [],                    
                    message: "Please log in to your account"
                });
            }else{

                const userId = decodedToken.id;      

                const { fileName, fileId, age, gender, height, weight, fitness_goals } = req.body;

                const items = JSON.parse(fitness_goals);

                


                try {


                    if(fileName === null){
                        return res.status(400).json({message: "No file uploaded"});
                    }
                    else{                     

                            const query = 'INSERT INTO client (image_url, image_id, gender, age_range, height, weight, user_id) VALUES(?)';

                            let values = [fileName, fileId, gender, age, height, weight, userId];

                            db.query(query,[values], (err, result) => {
                        
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                        
                                if(result){
                                
                                    clientId = result.insertId;
    
                                    const query2 = "INSERT INTO fitness_goal (goal, client_id, user_id) VALUES ?";
    
                                    
                                    db.query(query2, [items.map(item => [item.item, clientId, userId])], (err, result2) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }

                                        if(result2){
                                            return res.status(201).json({
                                                logIn: true,
                                                message: "Profile successfully created"
                                            });
                                        }
                                                                            
    
                                        
                                    });   
    
    
    
                                    
                                }
                                else{
                                    return res.status(204).json({message: "No profile was created"})
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

                                            if(equipments.length === 0){
                         
                                                return res.status(201).json({
                                                    logIn: true,
                                                    message: "Class successfully created"
                                                });
                                            
                                            }

                                            if(equipments.length > 0){

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

                            const checkClassQuery = "SELECT * FROM class_client WHERE class_id = ? AND client_id = ?";
                            
                            db.query(checkClassQuery, [[classId], [clientId]], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length > 0){
                                    return res.status(200).json({
                                        logIn: true,
                                        message: "You are already enrolled to this class"
                                    })
                                }
                                if(result2.length === 0){

                                    const classInsertQuery = "INSERT INTO class_client (class_id, trainer_id, client_id) VALUES (?)";

                                    const insertValues = [classId, trainerId, clientId]
            
                                    db.query(classInsertQuery, [insertValues], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result3){
                                            return res.status(201).json({
                                                logIn: true,
                                                message: "New class successfully added"
                                            })
                                        }
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
    }       
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


exports.getClient = (req, res, next) => {

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

                    const userId = decodedToken.id;

                    const getTrainerId = "SELECT trainer_id FROM trainer WHERE user_id = ?";

                    db.query(getTrainerId, [userId], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result.length === 0){
                            return res.status(204).json({
                                clients: [],
                                logIn: true
                            });

                        }
                        if(result.length > 0){

                            const trainerId = result[0].trainer_id;

                            const queryClient = "SELECT firstName, lastName, cl.image_url AS profileImage, cl.image_id AS publicId, city, state, group_concat(DISTINCT goal) as goals, c.format FROM user u\
                                                \INNER JOIN client cl ON u.user_id = cl.user_id INNER JOIN fitness_goal f ON cl.client_id = f.client_id INNER JOIN class_client s\
                                                \ON f.client_id = s.client_id INNER JOIN class c ON s.class_id = c.class_id INNER JOIN trainer t ON c.trainer_id = t.trainer_id\
                                                \WHERE t.trainer_id = ? GROUP BY firstName";
                                    



                            db.query(queryClient, [trainerId],  (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){

                                    return res.status(204).json({
                                        clients: [],
                                        logIn: true
                                        
                                    });
                                    
                                }
                                if(result2.length > 0){

                                    let clients = []

                                    result2.forEach(item => {

                                        const goals = splitItems(item.goals);

                                        let client = {...item, goals};

                                        clients.push(client);


                                    })

                                            

                                    return res.status(200).json({
                                        clients: clients,
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

                    const userId = decodedToken.id;

                    const getClientId = "SELECT client_id FROM client WHERE user_id = ?";

                    db.query(getClientId, [userId], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result.length === 0){
                            return res.status(204).json({
                                trainers: [],
                                logIn: true
                            });

                        }
                        if(result.length > 0){

                            const clientId = result[0].client_id;

                            
                            const getTrainerRating = (rating, ratingNum) => {

                                if(rating === 0 || ratingNum === 0 ){
                                    return 0;
                                }
                                else{
                                    return rating/ratingNum;

                                }
                            }

                            const queryTrainers = "SELECT t.trainer_id AS trainerId, t.image_url AS profileImage, t.image_id AS publicId, firstName, lastName, city, state, rating, number_of_rating AS ratingNum, GROUP_CONCAT(DISTINCT specialization_name) AS specializations\
                                                    \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN specialization s ON t.trainer_id = s.trainer_id INNER JOIN class c\
                                                    \ON s.trainer_id = c.trainer_id INNER JOIN class_client cc ON c.class_id = cc.class_id WHERE cc.client_id = ? GROUP BY firstName";
                                    



                            db.query(queryTrainers, [clientId],  (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){

                                    return res.status(204).json({
                                        trainers: [],
                                        logIn: true
                                        
                                    });
                                    
                                }
                                if(result2.length > 0){

                                    const trainers = [];

                                    result2.forEach(item => {

                                        let trainerRating  = getTrainerRating(item.rating, item.ratingNum)
                                        const specializations = splitItems(item.specializations);

                                        let trainer = {...item, specializations, trainerRating};

                                        trainers.push(trainer);


                                    })

                                   
                                    return res.status(200).json({
                                        trainers: itemShuffle(trainers),
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
                        if(result.length === 0){
    
                            return res.status(204).json({
                                classes: [],
                                logIn: true
                            });
                            
                        }
                        if(result.length > 0){

                            const userId = decodedToken.id;

                            const allClasses = splitClass(result);

                            const getClientQuery = "SELECT client_id FROM client WHERE user_id = ?";

                            const myClassQuery = "SELECT class_id AS classId, trainer_id, client_id FROM class_client WHERE client_id = ?";

                            db.query(getClientQuery, [userId], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){
                                    return res.status(200).json({
                                        classes: allClasses,
                                        logIn: true
                                    });
                                }
                                if(result2.length > 0){
                                    const clientId = result2[0].client_id;

                                    db.query(myClassQuery, [clientId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }

                                        if(result3.length === 0){
                                            return res.status(200).json({
                                                classes: allClasses,
                                                logIn: true
                                            });
                                        }
                                        if(result3.length > 0){
                                            
                                            const myClass = result3;

                                            const classes = allClasses.filter((element )=> !myClass.find(item => element.classId === item.classId ));

                                            return res.status(200).json({
                                                classes: itemShuffle(classes),
                                                logIn: true
                                            });
                                            
                                            
                                        }


                                    })


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
    
                    const getOneClassQuery1 = "SELECT c.class_id AS classId, t.trainer_id AS trainerId, firstName, lastName, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.equipment_id) AS equipmentId, GROUP_CONCAT(e.name) AS equipmentName\
                                        \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN class c ON t.trainer_id = c.trainer_id INNER JOIN schedule s ON c.class_id = s.class_id\
                                        \INNER JOIN equipment e ON s.class_id = e.class_id WHERE c.class_id = ?";


                    const getOneClassQuery2 = "SELECT c.class_id AS classId, t.trainer_id AS trainerId, firstName, lastName, type, level, format, description, start_time, end_time, start_date, frequency\
                                                \FROM user u INNER JOIN trainer t ON u.user_id = t.user_id INNER JOIN class c ON t.trainer_id = c.trainer_id\
                                                \INNER JOIN schedule s ON c.class_id = s.class_id WHERE c.class_id = ?";
    
                     db.query(getOneClassQuery1,[id], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }


                        if(result[0].classId === null || result.length === 0){
                            db.query(getOneClassQuery2, [id], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }

                                if(result2.length > 0){
                                    const equipments = [];
                                    const oneClass = {...result2[0], equipments}

                                   
                                    return res.status(200).json({
                                        oneClass: [oneClass],
                                        logIn: true
                                    });
                                }
                                if(result2.length === 0){
                                    return res.status(204).json({
                                        oneClass: [],
                                        logIn: true
                                    });
                                }
                            })
                        }


                        else{
    
                            const equipmentIds = result[0].equipmentId.split(",");
                            const equipmentNames = result[0].equipmentName.split(",");
    
                            const equipments = [];
    
                            
                            for(let i = 0; i < equipmentIds.length; i++){
    
                                equipments.push({ id: equipmentIds[i], item: equipmentNames[i]});
    
                            };
    
                            const oneItem = {...result[0], equipments: equipments};

                            const oneClass = splitClass([oneItem]);
                           
    
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


exports.offeredClasses = (req, res, next) => {

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

                try {

                    const trainerId = parseInt(id);
    
                    const getClassesQuery = "SELECT c.class_id AS classId, type, level, format, description, start_time, end_time, start_date, frequency, GROUP_CONCAT(DISTINCT e.name) AS equipments\
                            \FROM class c INNER JOIN schedule s ON c.class_id = s.class_id INNER JOIN equipment e ON s.class_id = e.class_id WHERE c.trainer_id = ? GROUP BY c.date_created";
        
        
        
                    db.query(getClassesQuery, [trainerId], (err, result) => {
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
                           
                            const classes = splitClass(result);

                            const userId = decodedToken.id;

                            const getClientQuery = "SELECT client_id FROM client WHERE user_id = ?";

                            const myClassQuery = "SELECT class_id AS classId, trainer_id, client_id FROM class_client WHERE client_id = ?";

                            db.query(getClientQuery, [userId], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length === 0){
                                    return res.status(200).json({
                                        classes: [],
                                        logIn: true
                                    });
                                }
                                if(result2.length > 0){
                                    const clientId = result2[0].client_id;

                                    db.query(myClassQuery, [clientId], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }

                                        if(result3.length === 0){
                                            return res.status(200).json({
                                                classes: [],
                                                logIn: true
                                            });
                                        }
                                        if(result3.length > 0){
                                            
                                            const myClasses = result3;

                                            const addedClass = classes.filter((element) => myClasses.find(item => element.classId === item.classId));
                                            const notAddedClass = classes.filter((element) => !myClasses.find(item => element.classId === item.classId));

                                            const registeredClasses = addedClass.map((a)=> {
                                                return {...a, isRegistered: true}
                                            })

                                            const notRegisteredClasses = notAddedClass.map((b)=> {
                                                return {...b, isRegistered: false}
                                            });

                                            const allClasses = [...registeredClasses, ...notRegisteredClasses];

                                        

                                            return res.status(200).json({
                                                classes: itemShuffle(allClasses),
                                                logIn: true
                                            });
                                            
                                            
                                        }


                                    })


                                }
                            })


                            
                        }
                    })
                    
                } catch (error) {
                    next(createError("Internal server error"));
                    
                }

            }
        });

    }
    

}

exports.rateTrainer = (req, res, next) => {
    const id = req.params.id;
    
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
                const trainerId = id;

                const getClientQuery = "SELECT client_id FROM client WHERE user_id = ?";

                try {

                    
                    db.query(getClientQuery, [userId], (err, result) => {

                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
    
                        if(result){
    
                            clientId = result[0].client_id;

                                
                            const {rating} = req.body;


                            const checkRateQuery = "SELECT * FROM rating WHERE client_id = ? AND trainer_id = ?";
                           

                            db.query(checkRateQuery, [[clientId], [trainerId]], (err, result2) => {
                                if(err){
                                    next(createError("Internal server error"));
                                    return;
                                }
                                if(result2.length > 0){
                                    return res.status(200).json({
                                        logIn: true,
                                        message: "You have already rated this trainer"
                                    })
                                }
                                if(result2.length === 0){

                                    const rateInsertQuery = "INSERT INTO rating (rating_number, client_id, trainer_id) VALUES (?)";
                                    const updateTrainerQuery = "UPDATE trainer SET rating = rating + ?, number_of_rating = number_of_rating + 1 WHERE trainer_id = ?";

                                    const insertValues = [rating, clientId, trainerId]
            
                                    db.query(rateInsertQuery, [insertValues], (err, result3) => {
                                        if(err){
                                            next(createError("Internal server error"));
                                            return;
                                        }
                                        if(result3){



                                            db.query(updateTrainerQuery, [[rating], [trainerId]], (err, result4) => {

                                                if(err){
                                                    next(createError("Internal server error"));
                                                    return;
                                                }
                                                if(result4){
                                                    return res.status(201).json({
                                                        logIn: true,
                                                        message: "Trainer successfully rated"
                                                    });
                                                }
                                                

                                            });
                                            
                                        }
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

        });
    }
}


