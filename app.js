const express = require('express')
const path = require('path')
const http = require('http')
const {Server} =require("socket.io")
const app = express();
app.set("view engine","ejs")
app.set("views",path.resolve('./views'))
const myserver = http.createServer(app)
const io = new Server(myserver)
io.on('connection',(socket)=>{
    // console.log("socket connected")

    socket.on("message",(data)=>{
        io.sockets.emit("message",data)
    })

    socket.on("disconnect",()=>{
        console.log("socket disconnected")
    })
})
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.render('index')
})
const port = 8000;
myserver.listen(port,()=>{
    console.log("hello server connected")
})