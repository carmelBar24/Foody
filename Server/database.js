const mysql = require('./node_modules/mysql2');
const path = require("path");
const constants = require("constants");
const { resolve } = require('path');

const options =
    {
        'host'              : 'localhost',
        'user'              : 'root',
        'password'          : '4364',
        'database'          : 'foodblog',
        'supportBigNumbers' : true,
        'waitForConnections': true,
        'connectionLimit'   : 5,
        'queueLimit'        : 5
    };

const pool = mysql.createPool(options);

//sign in
module.exports.insertUserToDataBase = insertUserToDataBase;
//login
module.exports.checkUserInDataBase=checkUserInDataBase;

async function insertUserToDataBase(user_name, user_email, user_password) {
    let userNameDuplicate = 0;
    let queryStr = "SELECT * FROM users WHERE userName = ?";
    const checkIfExistPromise = new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            else {
                const query = connection.format(queryStr, [user_name]);
                connection.query(query, function (err1, result) {
                if (err1) {
                   throw err1;
                }
                else
                    {
                        if (result.length != 0) {
                            userNameDuplicate = 1;
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
                connection.release();
            }
        });
    });
    let resultOfQuery = await checkIfExistPromise;
    const sqlInsert = "INSERT INTO users VALUES (?,?,?)";
    let signUpPromise;
    if (resultOfQuery == false) {//This user_name does not exist in the table.
        signUpPromise= new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                const insert_query = connection.format(sqlInsert,[user_password,user_name,user_email]);
                connection.query(insert_query, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("------> created new user");
                    }
                    resolve(true);
                });
                connection.release()
            });
        });

    }
    await signUpPromise;
    return userNameDuplicate;
}

async function checkUserInDataBase(user_name, user_password) {
    let userNotExist = 0;
    const sqlSearch = "SELECT * FROM users WHERE userName = ? and password = ?"
    const loginPromise = new Promise(function(resolve, reject) {
        pool.getConnection(function (err, connection) {
            const search_query = connection.format(sqlSearch,[user_name,user_password]);
            connection.query(search_query, function (err1, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result.length);
                    if (result.length == 0) {
                        userNotExist = 1;
                        resolve(true);
                    } else {
                        resolve(false);
                    }

                }
            });
            connection.release();
        });
    });
    await loginPromise;
    return userNotExist;
}

