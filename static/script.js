const socket = io();

$(document).ready(() => {
    $("form").submit((e) => {
        e.preventDefault();
        socket.emit("room", $("form").serializeArray())
    })

    socket.on("viewer", data => {
        let roomID;
        data.forEach(chunk => {
            if (chunk.name=="uuid") {
                roomID=chunk.value;
            }
        })
        location.href= "/room?id=" + roomID;
    })
})