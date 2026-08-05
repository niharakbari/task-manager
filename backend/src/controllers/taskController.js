const asyncHandler = require("../utils/asyncHandler");

const { formatDateForDatabase, formatDateForResponse } =require ("../utils/dateUtils")

const taskService = require('../services/taskService');
const AppError = require("../utils/AppError");


// create task
const createTask = asyncHandler( async(req, res) => {

    const task = {
        ...req.body,
        user_id: req.user.id,
        due_at : formatDateForDatabase(req.body.due_at),
    
    };

     await taskService.createTask(task);

     return res.status(201).json({
        success : true,
        message : "Task Created Successfully"
     })

} );


// get all tasks
const getAllTasks = asyncHandler(async (req, res) => {

    const filters = {
        userId: req.user.id,
        search: req.query.search,
        status: req.query.status,
        priority: req.query.priority,
        month: req.query.month,
        year: req.query.year,
        sort: req.query.sort,
        order: req.query.order,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    };

    const result = await taskService.getAllTasks(filters);

    result.tasks = result.tasks.map(task => ({
        ...task,
        due_at: formatDateForResponse(task.due_at),
        completed_at: formatDateForResponse(task.completed_at)
    }));

    return res.status(200).json({
        success: true,
        ...result
    });

});


const getTaskById = asyncHandler(async (req, res) => {

    const task = await taskService.getTaskById(
        req.params.id,
        req.user.id
    );

    if(!task)
        throw new AppError("Task not found", 404);

    return res.status(200).json({
        success: true,
        task: {
            ...task,
            due_at: formatDateForResponse(task.due_at),
            completed_at: formatDateForResponse(task.completed_at)
        }
    });

});


const updateTask = asyncHandler(async (req, res) => {

    const task = {
        ...req.body,
        due_at: formatDateForDatabase(req.body.due_at)
    };

    await taskService.updateTask(
        req.params.id,
        req.user.id,
        task
    );

    return res.status(200).json({
        success: true,
        message: "Task updated successfully"
    });

});


const deleteTask = asyncHandler(async (req, res) => {

    await taskService.deleteTask(
        req.params.id,
        req.user.id
    );

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });

});

const bulkDeleteTasks = asyncHandler(async (req, res) => {

    await taskService.bulkDeleteTasks(
        req.user.id,
        req.body.taskIds
    );

    return res.status(200).json({
        success: true,
        message: "Tasks deleted successfully"
    });

});


const updateTaskStatus = asyncHandler(async (req, res) => {

    await taskService.updateTaskStatus(
        req.params.id,
        req.user.id,
        req.body.status
    );

    return res.status(200).json({
        success: true,
        message: "Task status updated successfully"
    });

});



module.exports= {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
    updateTaskStatus

}