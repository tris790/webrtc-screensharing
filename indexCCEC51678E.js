let peer = new Peer({
    iceServers: [
        { url: "stun.l.google.com:19302" },
        { url: "stun1.l.google.com:19302" },
        { url: "stun2.l.google.com:19302" },
        { url: "stun3.l.google.com:19302" },
        { url: "stun4.l.google.com:19302" },
        { url: "stun.ekiga.net" },
        { url: "stun.ideasip.com" },
        { url: "stun.rixtelecom.se" },
        { url: "stun.schlund.de" },
        { url: "stun.stunprotocol.org:3478" },
        { url: "stun.voiparound.com" },
        { url: "stun.voipbuster.com" },
        { url: "stun.voipstunt.com" },
        { url: "stun.voxgratia.org" },
    ],
});

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

async function call(id) {
    console.log("Calling:", id);
    const mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
    mediaConnection = peer.call(id, mediaStream);

    mediaConnection.on("stream", function (stream) {
        return;
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