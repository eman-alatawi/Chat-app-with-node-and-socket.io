const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) =>{
    console.log(`Client connected: ${socket.id}`)
    
    socket.on('send_message', (data) =>{
        io.emit('receive_message', data)
        console.log(data)
    })
})

server.listen(3000, ()=>{
    console.log("Server started on port 3000")
})