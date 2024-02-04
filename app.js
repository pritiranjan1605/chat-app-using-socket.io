const dotenv = require('dotenv');
dotenv.config();




const jwt = require('jsonwebtoken')
const secret = "vGuWUZSBgk"

function setuser(user){
    const payload = {
        // name:user.name,
        email:user.email,
        password:user.password
    }
    const token = jwt.sign(payload,secret)
    return token;
}

function getuser(token1){
    const token = jwt.verify(token1,secret)
    return token;
}



const cookie = require('cookie-parser')
const User = require('./models/user')
const {v4:uuidv4} =require('uuid')
const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const http = require('http')
const {Server} =require("socket.io");
const cookieParser = require('cookie-parser');
const app = express();




mongoose.connect("mongodb://127.0.0.1:27017/chatlyy").then(()=>console.log("connected")).catch((err)=>console.log(err))


app.set("view engine","ejs")
app.set("views",path.resolve('./views'))
const myserver = http.createServer(app)
const io = new Server(myserver)
io.on('connection',(socket)=>{
    console.log("socket connected")
    console.log(socket.id)
    socket.on("message",(data)=>{
        io.sockets.emit("message",{message:data,id:socket.id})
    })

    socket.on("disconnect",()=>{
        console.log("socket disconnected")
    })
})
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.post('/signup',async (req,res)=>{
    const {name ,email,password} = req.body;
    if ( !name || !email || !password) {
        console.log("nothing is present")
        return res.render('signup')
    }
    const user = await User.create({
        name,email,password
    })
    
    return res.render("login")

})

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    if (!req.body) {
        console.log("nothing is present")
        return res.render('login')
    }
    console.log(email,password)
    const user  = await User.findOne({email,password})
    if(!user){
        console.log("no such user found")
        return res.render('login',{
            error:"incorrect email or password"
        })
    }
    const token = setuser(user,secret)
    res.cookie('token',token)

    return res.render('index') 
})




app.get('/',(req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected")).catch((err)=>console.log(err))
const port = process.env.PORT || 8000;
myserver.listen(port,()=>{
    console.log("hello server connected")
})