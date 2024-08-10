const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const { taskRouter } = require("./routes/taskRoutes");
const { notificationRouter } = require("./routes/notificationRoutes");

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server);

app.set('io',io);
require('./sockets/socket')(io);

app.use("/users",userRouter)
app.use("/tasks",taskRouter)
app.use("/notifications", notificationRouter)

app.get("/",async(req,res)=>{
    res.send("Welcome")
})

app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("connected to db");
        console.log(`Server is running at ${process.env.port}`)
    } catch (error) {
        console.log("Error connecting to db")
    }
})