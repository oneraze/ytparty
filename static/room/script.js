const socket = io();

$(document).ready(() => {
    // get room id
    let uuid = new URL(location).searchParams.get("id");

    // add join link
    $("#invitelink").click(() => {
        navigator.clipboard.writeText("http://localhost:3000/join?id=" + uuid).then(() => {
            $("#invitelink").val("Copied!")
        }, () => {
            console.log("Error")
        })
    });

    let payload = {
        name: sessionStorage.getItem("name"),
        uuid: uuid
    }

    socket.emit("joined", payload);

    socket.on("new user", data => {
        $(".messages").append("<span>" + data + "</span>");
    })

    $("form").submit((e) => {
        e.preventDefault();

        let payload = {
            name: sessionStorage.getItem("name"),
            message: $("form #message").val(),
            uuid: uuid
        }

        $("form #message").val("");

        socket.emit("message", payload);
    })

    socket.on("message", data => {
        $(".messages").append("<div class=\"message\"><b>" + data.name + ": </b><span>" + data.message + "</span></div>");
    })
})