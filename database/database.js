const createError = require('http-errors');
const mysql = require('mysql');
require('dotenv').config();



// create connection
const db = mysql.createPool({
    
    host: process.env.HOST,
    user:  process.env.USER,
    password:  process.env.PASSWORD,
    database:  process.env.DATABASE
    
})


//connect to MySql
db.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if(err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection){
        console.log("Database connected successfully");
        connection.release();
    }

    return;
})

 module.exports = db;


 