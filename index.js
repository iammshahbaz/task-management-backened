const express = require("express");
const cors = require("cors");
const http = require("http");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const { taskRouter } = require("./routes/taskRoutes");
const { notificationRouter } = require("./routes/notificationRoutes");
const socketIo = require("socket.io")
require("dotenv").config(); 


const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// const io = socketIo(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: "http://localhost:8080",  
//     },
// });


// io.on('connection', (socket) => {
//     console.log('User connected', socket.id);
    
//     socket.on('join', (userId) => {
//         socket.join(userId);
//         console.log(`Socket ${socket.id} joined room: ${userId}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('taskAssigned', (data) => {
        io.emit('taskAssigned', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


app.set('io', io);

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

