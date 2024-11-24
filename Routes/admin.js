const { Router } = require("express");
const adimnRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");
const course = require("./course");

adimnRouter.post("/signup", async function(req, res) {
    const { email, password , firstname, lastname } = req.body;

    try {
        const existingUser = await adminModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await adminModel.create({
                email,
                password: hashedPassword,
                firstname,
                lastname
            });
            res.json({
                message: "User created successfully"
            })
        
        }catch(error){
        console.log(error);
        res.status(500).json({error: "signup failed "});
        }
})

adimnRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Create JWT
        const token = jwt.sign({ id: admin._id, email: admin.email }, "JWT_ADMIN_PASSWORD", { expiresIn: "1h" });

        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Signin failed" });
    }
})

adimnRouter.post("/mycourses", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    if (!adminId) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    const { title, description, imageUrl, price } = req.body;

    try {
        const course = await courseModel.create({
            title,
            description, // Fixed typo
            imageUrl,
            price,
            creatorId: adminId,
        });
        res.json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create course" });
    }
});


adimnRouter.put("/mycourses",adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const {title , description, imageUrl, price, couseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })
    res.json({
        message: "Course Updated",
        courseId: course._id
    })
})

adimnRouter.get("/mycourses",adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const course = await courseModel.find({
        _id: courseId,
        creatorId: adminId
    })
    res.json({
        message: "Course Updated",
        courseId: adminId
    })
})

module.exports = {
    adimnRouter: adimnRouter
}