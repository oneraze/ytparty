const { v4: uuid } = require('uuid');
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('port', 3000);
app.use(express.static("static"))

// map for youtube videos
let videoMap = new Map();

io.on("connection", socket => {
    // register a new viewer
    socket.on("watcher", data => {
        var uuidi = uuid()

        let payload = {
            uuid: uuidi,
            name: data.name,
            ytvideo: data.ytvideo
        }

        videoMap.set(uuidi, data.ytvideo);

        // give back the room id
        socket.emit("uuid", payload);
    });

    // when user joins the room...
    socket.on("joined", data => {
        // join room
        socket.join(data.uuid);
        io.to(data.uuid).emit("new user", data.name + " joined the party!");
    })

    socket.on("message", data => {
        if (data.message.trim() != "") {
            let payload = {
                name: data.name,
                message: data.message.replace("<", "&lt;").replace(">", "&gt;")
            }
            
            io.to(data.uuid).emit("message", payload);
        }
    })

    socket.on("videoRequest", data => {
        let ytvideo = videoMap.get(data);
        socket.emit("video", ytvideo);
    })

    socket.on("pause", (uuid) => {
        io.to(uuid).emit("pause")
    })

    socket.on("play", (uuid) => {
        io.to(uuid).emit("play")
    })

    socket.on("sync", (data) => {
        io.to(data.id).emit("sync", data.et);
    })
})

const listener = server.listen(3000, () => {
    console.log("Listening on port ", listener.address().port)
});