let peer = new Peer();
let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

let mediaConnection;
const options = {
    video: {
        cursor: "always",
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
    },
};

peer.on("open", () => {
    document.getElementById("myId").value = peer.id;
});

peer.on("call", async function (call) {
    console.log("Getting a call from:", call);
    // Answer the call, providing our mediaStream
    mediaConnection = call;
    call.answer(stream);
    // const myStream = await navigator.mediaDevices.getDisplayMedia(options);
    mediaConnection.answer();

    mediaConnection.on("stream", function (stream) {
        console.log("Stream event:", stream);
        window.peer_stream = stream;
        let video = document.getElementById("remoteVideo");
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
            video.play();
        };

        onStreamStart();
    });
});

peer.on('call', function (call) {
    console.log("Getting a call from:", call);
    mediaConnection = call;

    call.answer(stream); // Answer the call with an A/V stream.

    call.on('stream', function (stream) {
        console.log("Stream event:", stream);
        window.peer_stream = stream;

        let video = document.getElementById("remoteVideo");
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
            video.play();
        };

        onStreamStart();
    });
});

async function call(id) {
    console.log("Calling:", id);
    getUserMedia({ video: true, audio: true }, function (stream) {
        let call = peer.call(id, stream);
        call.on('stream', function (remoteStream) { });
    }, function (err) {
        console.log('Failed to get local stream', err);
    });
}

function onCallPartner() {
    const partnerId = document.getElementById("partnerId").value;
    call(partnerId);
}

function onStreamerClicked() {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("tutorial").style.display = "block";
    document.getElementById("streamer-more-info").style.display = "block";
}

function onViewerClicked() {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("tutorial").style.display = "block";
    document.getElementById("viewer-more-info").style.display = "block";
}

function onStreamStart() {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("stream").style.display = "block";
}

function onStreamStop() {
    document.getElementById("lobby").style.display = "block";
    document.getElementById("stream").style.display = "none";
}
