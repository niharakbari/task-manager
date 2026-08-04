const asyncHandler = require("../utils/asyncHandler");

const { formatDateForDatabase, formatDateForResponse } =require ("../utils/dateUtils")

const taskService = require('../services/taskService');


// create task
const createTask = asyncHandler( async(req, res) => {

    const task = {
        ...req.body,
        user_id: req.user.id,
        due_at : formatDateForDatabase(req.body.due_at),
    
    };

     await taskService.createTask(task);

     return res.status(201).json({
        success : "true",
        message : "Task Created Successfully"
     })

} );


// get all tasks
const getAllTasks = asyncHandler(async (req, res) => {

    const tasks = await taskService.getAllTasks(req.user.id);

    const formattedTasks = tasks.map(task => ({
        ...task,
        due_at: formatDateForResponse(task.due_at),
        completed_at: formatDateForResponse(task.completed_at)
    }));

    return res.status(200).json({
        success: true,
        tasks: formattedTasks
    });

});



module.exports= {
    createTask,
    getAllTasks

}