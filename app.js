const { v4: uuid } = require('uuid');
const uuidi = uuid()
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 3000);
app.use(express.static("static"));

let matrixMap = new Map();
function getvid (obj) {
    return obj.name == "ytvideo"
}

function getname (obj) {
    return obj.name == "name"
}

let name;
io.on("connection", socket => {
    socket.on("room", data => {
        socket.join(uuidi);
        data.push({name: "uuid", value: uuidi})
        io.to(uuidi).emit("viewer", data);
        name = data.filter(getname)[0].value;;
        matrixMap.set(uuidi, data.filter(getvid)[0].value)
    })

    socket.on("joinroom", data => {
        socket.join(data.id);
        name = data.name;
        socket.emit("joining", data.id);
    })

    socket.on("joinedroom", data => {
        socket.join(data)
        io.to(data).emit("name", name)
    })

    socket.on("message", data => {
        io.to(data.room).emit("message", {
            message: data.message,
            name: data.name
        })
    })

    socket.on("play", (data) => {
        socket.to(data).broadcast.emit("play");
    })

    socket.on("pause", (data) => {
        socket.to(data).broadcast.emit("pause");
    })

    socket.on("sync", data => {
        socket.to(data.id).broadcast.emit("sync", data.et);
    })

    socket.on("videoRequest", data => {
        let info = matrixMap.get(data.room);
        socket.emit("roomInfo", {
            video: info,
            name: name
        })
    })
})
const listener = server.listen(3000, () => {
    console.log("Listening on port ", listener.address().port)
});