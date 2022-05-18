const db = require('../database/dbConfig');
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

        const {firstName, lastName, email, password, city, state, role} = req.body;

        const findUser = 'SELECT * FROM user WHERE email = ?';
    
    
        //querying
        db.query(findUser, [email], (err, user) => {
            if(user.length > 0){
                res.json({message: "This user already exists !!!"});
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
                            res.status(201).
                            json({
                                logIn: true,
                                message: "Account successfully created !!!"
                            });
    
                            next();
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


        db.query(query, [email],(err, result)=> {
            
            if(err){
                                    
                res.json("Incorrect username or password combination !!!");
            }

            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if(response){
                        
                        const userId = result[0].user_id;
                        const token = createToken(userId);
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        res.status(201).json({ logIn: true, message: "Login Successful" });
                    }
                    
                });
            }else{
                res.json({ message: "User doesn't exist !!!", logIn: false});
                next();
                
            }
        });
        
    } catch (error) {
        next(createError("Internal server error"));
    }

}



exports.logout = async (req, res) => {
    try {

        res.cookie('jwt', '', { maxAge: 1 });
        res.json({
            logIn: false,
            user: []
        });
        next();
        
    } catch (error) {
        next(createError("Internal server error"));
        
    }
    
};