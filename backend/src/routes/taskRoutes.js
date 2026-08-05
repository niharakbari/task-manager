const express = require('express');

const {taskValidation} = require('../validations/taskValidation');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.post("/", protect, taskValidation, validationMiddleware, taskController.createTask);

router.get("/", protect, taskController.getAllTasks);

router.get("/:id", protect, taskController.getTaskById);

router.put(
    "/:id",
    protect,
    taskValidation,
    validationMiddleware,
    taskController.updateTask
);

router.patch(
    "/:id/status",
    protect,
    taskController.updateTaskStatus
);

router.delete(
    "/:id",
    protect,
    taskController.deleteTask
);

router.post(
    "/bulk-delete",
    protect,
    taskController.bulkDeleteTasks
);

module.exports = router;