const db = require("../configurations/database");

const createTask = (task, callback) => {
    // const user_id = requser.id;
    
    const {
        user_id,
        title,
        description,
        priority,
        due_at
     } = task ;

    
    const sql = `INSERT INTO tasks (user_id, title, description, priority, due_at) VALUES (?, ?, ?, ?, ?);` ; 

    db.query(sql, 
        [
            user_id,
            title,
            description,
            priority,
            due_at
        ],
        callback
    );

};



const getAllTasks = (userId, callback) => {

    const sql = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
        ORDER BY due_at ASC
    `;

    db.query(sql, [userId], callback);

};

module.exports = {
    createTask,
    getAllTasks
}