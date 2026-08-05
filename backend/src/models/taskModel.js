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



const getAllTasks = (filters, callback) => {

    let sql = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
    `;

    let countSql = `
        SELECT COUNT(*) total
        FROM tasks
        WHERE user_id = ?
    `;

    const values = [filters.userId];
    const countValues = [filters.userId];

    if (filters.search) {

        sql += `
            AND (
                title LIKE ?
                OR description LIKE ?
            )
        `;

        countSql += `
            AND (
                title LIKE ?
                OR description LIKE ?
            )
        `;

        values.push(
            `%${filters.search}%`,
            `%${filters.search}%`
        );

        countValues.push(
            `%${filters.search}%`,
            `%${filters.search}%`
        );

    }

    if (filters.status) {

        sql += ` AND status = ?`;
        countSql += ` AND status = ?`;

        values.push(filters.status);
        countValues.push(filters.status);

    }

    if (filters.priority) {

        sql += ` AND priority = ?`;
        countSql += ` AND priority = ?`;

        values.push(filters.priority);
        countValues.push(filters.priority);

    }

    if (filters.month) {

        sql += ` AND MONTH(due_at)=?`;
        countSql += ` AND MONTH(due_at)=?`;

        values.push(filters.month);
        countValues.push(filters.month);

    }

    if (filters.year) {

        sql += ` AND YEAR(due_at)=?`;
        countSql += ` AND YEAR(due_at)=?`;

        values.push(filters.year);
        countValues.push(filters.year);

    }

    const allowedSort = [
        "due_at",
        "created_at",
        "priority",
        "title"
    ];

    const sort = allowedSort.includes(filters.sort)
        ? filters.sort
        : "due_at";

    const order =
        filters.order === "desc"
            ? "DESC"
            : "ASC";

    sql += `
        ORDER BY ${sort} ${order}
    `;

    const offset =
        (filters.page - 1) *
        filters.limit;

    sql += `
        LIMIT ?
        OFFSET ?
    `;

    values.push(
        filters.limit,
        offset
    );

    db.query(countSql, countValues, (err, countRows) => {

        if (err)
            return callback(err);

        db.query(sql, values, (err, rows) => {

            if (err)
                return callback(err);

            callback(null, {
                tasks: rows,
                total: countRows[0].total,
                page: filters.page,
                limit: filters.limit
            });

        });

    });

};



const getTaskById = (taskId, userId, callback) => {

    const sql = `
        SELECT *
        FROM tasks
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [taskId, userId], callback);

};


const updateTask = (taskId, userId, task, callback) => {

    const {
        title,
        description,
        priority,
        due_at
    } = task;

    const sql = `
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            priority = ?,
            due_at = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            title,
            description,
            priority,
            due_at,
            taskId,
            userId
        ],
        callback
    );

};


const deleteTask = (taskId, userId, callback) => {

    const sql = `
        DELETE FROM tasks
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [taskId, userId], callback);

};


const bulkDeleteTasks = (
    userId,
    taskIds,
    callback
) => {

    const sql = `
        DELETE
        FROM tasks
        WHERE user_id=?
        AND id IN (?)
    `;

    db.query(
        sql,
        [
            userId,
            taskIds
        ],
        callback
    );

};

const updateTaskStatus = (taskId, userId, status, callback) => {

    const completedAt =
        status === "completed"
            ? new Date()
            : null;

    const sql = `
        UPDATE tasks
        SET
            status = ?,
            completed_at = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            status,
            completedAt,
            taskId,
            userId
        ],
        callback
    );

};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
    updateTaskStatus
}