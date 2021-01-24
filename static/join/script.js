const socket = io();

$(document).ready(() => {
    const params = new URL(location).searchParams;

    if (params.get("id")) {
        socket.emit("videoRequest", {
            room: params.get("id")
        })
    }

    $("form").submit((e) => {
        e.preventDefault();
        socket.emit("joinroom", {
            name: $("form #name").val(),
            ytvideo: $("form #ytvideo").val(),
            id: params.get("id")
        })
    })

    socket.on("roomInfo", data => {
        $("#ytvideo").val(data.video)
    })

    socket.on("joining", data => {
        location.href = "/room?id=" + data;
    })
})