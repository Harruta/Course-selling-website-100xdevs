const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const { JWT_USER_PASSWORD } = require("../config");


userRouter.post("/signup", async function(req, res) {
    const { email, password , firstname, lastname } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await userModel.create({
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
userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Create JWT
        const token = jwt.sign({ id: user._id, email: user.email }, "JWT_USER_PASSWORD", { expiresIn: "1h" });

        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Signin failed" });
    }
});


userRouter.get("/purchases", async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });
    
    let purchasedCourseIds = [];
    
    for (let i = 0; i< purchases.length; i++){
    purchasedCourseIds.push(purchases[i].courseId)
    }
    
    const courseData = await courseModel.find({
      _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}
