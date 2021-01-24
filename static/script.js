const socket = io();

$(document).ready(() => {
    $("form").submit((e) => {
        e.preventDefault();
        let payload = {
            name: $("form #name").val(),
            ytvideo: $("form #ytvideo").val()
        }

        socket.emit("watcher", payload)
    })

    socket.on("uuid", data => {
        // store name and video in the session
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("ytvideo", data.ytvideo);

        // redirect to the room
        location.href = `/room?id=${data.uuid}`;
    })
})