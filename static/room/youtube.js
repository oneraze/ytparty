var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

const params = new URL(location).searchParams;
let id = params.get("id");

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: sessionStorage.getItem("videoId"),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    let elapsedTime = player.getCurrentTime();
    socket.emit("sync", {
        et: elapsedTime,
        id: id
    })
}

var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        socket.emit("play", id);
    } else if (event.data == YT.PlayerState.PAUSED) {
        socket.emit("pause", id);
    }
}

socket.on("play", (data) => {
    player.playVideo();
    $(".messages").prepend("<div><span>Video playing</span><div>")
})

socket.on("pause", () => {
    player.pauseVideo();
    $(".messages").prepend("<div><span>Video was paused</span><div>")
})

socket.on("sync", (data) => {
    console.log(data)
    player.seekTo(data, true)
})