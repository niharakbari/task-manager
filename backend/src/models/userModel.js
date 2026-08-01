const db  = require("../configurations/database");

const register = ( user, hashedPassword, callback )=> {

    const {
        username,
        first_name,
        last_name,
        email,
        mobile_number,
        date_of_birth,
        password_hash
    } = user;

const sql = "INSERT INTO task_magnager (username, first_name, last_name, email, mobile_number, date_of_birth, password_hash) values (?, ?, ?, ?, ?, ?, ?)";

db.query(sql, [username, first_name, last_name, email, mobile_number, date_of_birth, password_hash], callback);

}