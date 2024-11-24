require ('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");
const { adimnRouter } = require("./Routes/admin")
const PORT = 3000;
const app = express();
app.use(express.json());



app.use("/user", userRouter);
app.use("/admin", adimnRouter);
app.use("/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
main()