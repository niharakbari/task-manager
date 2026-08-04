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


const getAllTasks = (userId) => {

    return new Promise((resolve, reject) => {

        taskModel.getAllTasks(userId, (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

};

module.exports = {
    createTask,
    getAllTasks
}