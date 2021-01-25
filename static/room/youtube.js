var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// uuid
let uuid = new URL(location).searchParams.get("id");

// parse youtube video function
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

// get video ID from the function
let videoId;

if (sessionStorage.getItem("ytvideo")) {
    videoId = youtube_parser(sessionStorage.getItem("ytvideo"));
}

// set up youtube video
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // event.target.playVideo();
    console.log(event);
}

function sync() {
    let elapsedTime = player.getCurrentTime();
    socket.emit("sync", {
        et: elapsedTime,
        id: uuid
    })
    console.log("blo")
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        socket.emit("play", uuid);
    } else if (event.data == YT.PlayerState.PAUSED) {
        socket.emit("pause", uuid);
        sync();
    }
}

socket.on("play", () => {
    console.log("blooooo")
    player.playVideo();
})

socket.on("pause", () => {
    console.log("bloooooo")
    player.pauseVideo();
    sync();
})

socket.on("sync", (data) => {
    console.log(data)
    player.seekTo(data)
    player.pauseVideo();
})