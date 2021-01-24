const socket = io();

$(document).ready(() => {
    const params = new URL(location).searchParams;

    if (params.get("id")) {
        socket.emit("videoRequest", {
            room: params.get("id")
        })

        socket.emit("joinedroom", params.get("id"))

        $(".invitelink").html("http://localhost:3000/join?id=" + params.get("id"));
    }

    function getId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        return (match && match[2].length === 11)
          ? match[2]
          : null;
    }

    socket.on("roomInfo", data => {
        // console.log(data)
        sessionStorage.setItem("videoId", getId(data.video));
        sessionStorage.setItem("name", data.name)
        console.log(JSON.stringify(data));
    })

    socket.on("name", data => {
        $(".messages").prepend("<div><span>" + data + " Joined the room</span><div>")
    })

    $("form").submit((e) => {
        e.preventDefault();
        let message = $("form #message").val();

        socket.emit("message", {
            name: sessionStorage.getItem("name"),
            room: params.get("id"),
            message: message
        })
    })

    socket.on("message", data => {
        $(".messages").prepend("<div><span><b>" + data.name + "</b>: " + data.message + "</span><div>")
        $("input").val("")
    })
})