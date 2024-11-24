const { Router } = require("express");
const courseRouter = Router();

// POST route for purchasing a course
courseRouter.post("/purchase", function (req, res) {
    res.json({
        message: "Course purchased successfully",
    });
});

// GET route for course preview
courseRouter.get("/preview", function (req, res) {
    res.json({
        message: "Course preview",
    });
});

module.exports = {
    courseRouter: courseRouter,
};
