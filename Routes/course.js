const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

// POST route for purchasing a course
courseRouter.post("/purchase", async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;;

    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "Course has been purchased successfully",
    });
});

// GET route for course preview
courseRouter.get("/preview", async function (req, res) {
    const courses = await courseModel.find({});

    res.json({
        courses
    });
});

module.exports = {
    courseRouter: courseRouter,
};
