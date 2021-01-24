const socket = io();

$(document).ready(() => {
    // get room id
    let uuid = new URL(location).searchParams.get("id");

    $("form").submit((e) => {
        e.preventDefault();

        sessionStorage.setItem("name", $("form #name").val());

        location.href = "/room?id=" + uuid;
    })

    socket.emit("videoRequest", uuid);

    socket.on("video", data => {
        $("form #ytvideo").val(data);
        sessionStorage.setItem("ytvideo", data);
    })
})