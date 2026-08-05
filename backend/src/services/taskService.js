const taskModel = require('../models/taskModel');

const createTask = (task) => {

    return new Promise( (resolve, reject) => {

        taskModel.createTask(task, (err, result) => {

            if(err)
                return reject(err);

            resolve();

        })

    });
};


const getAllTasks = (filters) => {

    return new Promise((resolve, reject) => {

        taskModel.getAllTasks(filters, (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};


const getTaskById = (taskId, userId) => {

    return new Promise((resolve, reject) => {

        taskModel.getTaskById(taskId, userId, (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows[0]);

        });

    });

};


const updateTask = (taskId, userId, task) => {

    return new Promise((resolve, reject) => {

        taskModel.updateTask(taskId, userId, task, err => {

            if (err)
                return reject(err);

            resolve();

        });

    });

};


const deleteTask = (taskId, userId) => {

    return new Promise((resolve, reject) => {

        taskModel.deleteTask(taskId, userId, err => {

            if (err)
                return reject(err);

            resolve();

        });

    });

};


const bulkDeleteTasks = (userId, taskIds) => {

    return new Promise((resolve, reject) => {

        taskModel.bulkDeleteTasks(
            userId,
            taskIds,
            err => {

                if (err)
                    return reject(err);

                resolve();

            }
        );

    });

};


const updateTaskStatus = (taskId, userId, status) => {

    return new Promise((resolve, reject) => {

        taskModel.updateTaskStatus(
            taskId,
            userId,
            status,
            err => {

                if (err)
                    return reject(err);

                resolve();

            }
        );

    });

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