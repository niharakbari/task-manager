const express = require('express');

const {taskValidation} = require('../validations/taskValidation');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.post("/", protect, taskValidation, validationMiddleware, taskController.createTask);

router.get("/", protect, taskController.getAllTasks);


module.exports = router;