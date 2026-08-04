const { body } = require("express-validator");

const dateUtils = require("../utils/dateUtils");

const taskValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title cant be empty")
        .isLength( {
            min : 4,
            max : 50
        } )
        .withMessage("Title must be between 4 to 50 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({
            max: 500
        })
        .withMessage("Description cannot exceed 500 characters"),

    body("priority")
        .notEmpty()
        .withMessage("Priority is required")
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority"),

    body("due_at")
        .notEmpty()
        .withMessage("Due date is required")
        .custom((value) => {

            if (!dateUtils.isValidClientDate(value))
                throw new Error("Invalid due date");

            return true;
        })

];

module.exports = {
    taskValidation
};