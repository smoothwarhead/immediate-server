const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const saltRounds = 10;

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'fitness secret', {
        expiresIn: maxAge
    });
};




exports.register = (req, res, next) => {

    try {

        console.log(req)

        const {firstName, lastName, email, password, city, state, role} = req.body;

        const findUser = 'SELECT * FROM user WHERE email = ?';
    
    
        //querying
        db.query(findUser, [email], (err, user) => {
            if(err){
                next(createError("Internal server error"));
                return;
            }
            if(user.length > 0){
                return res.status(400).json({message: "This user already exists !!!"});
            }
            else{
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if(err){
                        next(createError("Internal server error"));
                        return;
                    }
    
                    const query = 'INSERT INTO user(firstName, lastName, email, password, city, state, role) VALUES (?)';
    
                    let values = [firstName, lastName, email, hash, city, state, role];
    
    
                    db.query(query, [values], (err, result) => {
                        if(err){
                            next(createError("Internal server error"));
                            return;
                        }
                        if(result){
                            const userId = result.insertId
                            const token = createToken(userId);
                            
                            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
                            return res.status(201).json({
                                logIn: true,
                                message: "Account successfully created !!!"
                            });
    
                        
                        }
                    });
                });
            }
        });
        
    } catch (error) {
        next(createError("Internal server error"));
        
    }

   

}


exports.login = (req, res, next) => {

    try {

        
        const { email, password } = req.body;
      
        const query = "SELECT * FROM user WHERE email = ?";


        db.query(query, [email], (err, result)=> {
            
            if(err){
                                    
                // res.json({ errorMessage: "Incorrect username or password combination !!!" });
                next(createError("Incorrect email or password combination !!!"));
                return
            }

            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response) => {

                    if(error){
                        next(createError("Incorrect email or password combination !!!"));
                        return
                    }
                    if(response){
                        
                        const userId = result[0].user_id;
                        const token = createToken(userId);
                        console.log(token);

                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        return res.status(200).json({ logIn: true, message: "Login Successful" });

                    }
                    
                });
            }else{
                
                return res.status(400).json({ logIn: false, message: "User does not exist. Please provide the correct email and password" });
                
            }
        });
        
    } catch (error) {
        next(createError("Internal server error"));
    }

}



exports.logout = async (req, res, next) => {
    try {

        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(200).json({
            logIn: false,
            user: []
        });
        
        
    } catch (error) {
        next(createError("Internal server error"));
        
    }
    
};