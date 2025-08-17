import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from 'cors'

const PORT = 3000;
const app   = express();
app.use(cors());

const server =  createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        credentials:true
    }
});

io.use((socket,next)=>{
    const user = true;
    if(user) next(); //example to demonstrate use of middlewares for sockets
})

io.on("connection",(socket)=>{
    console.log("a user connected");
    console.log("id =",socket.id);

    socket.emit("welcome",`welcome from server ${socket.id}`)
    socket.broadcast.emit("welcome",`user connected ${socket.id}`)
    
    socket.on("message",(data)=>{
        console.log(data);
    //   socket.broadcast.emit("recieveMsg",data);
    socket.to(data.room).emit("recieveMsg",data)
    })
    socket.on("disconnect",()=>{
        console.log("user disconnected ",socket.id)
    });
    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId);
    })
})

app.get("/",(req,res)=>{
    console.log("home page")
    res.json({
        message:"this is the home page"
    })
})

server.listen(PORT,()=>{
    console.log(`backend is listening on port ${PORT}`)
})
