let btn = document.querySelector("#record-button")
var isPlay = false;
let mediaRecorder;
let chunks = [];
let stream;

async function init() {

    const mediaStreamConstraints = {
        audio: {
            channelCount: 1,
            sampleRate: 8000,
            sampleSize: 8,
            volume: 1
        },
        
        video: {
            width: {  ideal: 1920, max: 1920 },
            height: {  ideal: 1080, max: 1080 }
        }
    }

    await navigator.mediaDevices.getDisplayMedia(mediaStreamConstraints).then(async displayStream => {
        [videoTrack] = displayStream.getVideoTracks();
        [audioTrack1] = displayStream.getAudioTracks();

        const mediaStreamConstraints = {
            audio: {
                channelCount: 1,
                sampleRate: 8000,
                sampleSize: 8,
                volume: 1
            },
            video: false
        }

        const audioStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints).catch(e => { throw e });
        [audioTrack] = audioStream.getAudioTracks();

        var OutgoingAudioMediaStream = new MediaStream();
        OutgoingAudioMediaStream.addTrack(audioTrack1);

        var IncomingAudioMediaStream = new MediaStream();
        IncomingAudioMediaStream.addTrack(audioTrack);

        const audioContext = new AudioContext();
        var dest = audioContext.createMediaStreamDestination();

        audioContext.createMediaStreamSource(OutgoingAudioMediaStream).connect(dest);
        audioContext.createMediaStreamSource(IncomingAudioMediaStream).connect(dest);
        //videoTrack
        stream = new MediaStream([dest.stream.getAudioTracks()[0]]); // do stuff//videoTrack, 
    }).catch(console.error);

    initMedia();
}

init();

function initMedia() {
    mediaRecorder = new MediaRecorder(stream, {
        //  mimeType: "video/webm"
         mimeType: 'video/webm; codecs=vp9'
       // mimeType: 'audio/webm'
        //mimeType: "video/opus"
    })

    mediaRecorder.addEventListener('dataavailable', function (e) {
        chunks.push(e.data)
    })

    mediaRecorder.addEventListener('stop', function () {
        let video = document.querySelector("video")
        video.src = URL.createObjectURL(new Blob(chunks, {
            type: chunks[0].type
        }))
        chunks = [];
        let a = document.createElement('a')
        a.href = video.src
        a.download = 'screen-video.mp3'//fake type
     //   a.click()
    })
}


btn.addEventListener("click", async function () {
    if (isPlay == true) {
        btn.innerHTML = 'record';
        isPlay = false;
        $("#video").css({ visibility: 'visible' })
        mediaRecorder.stop();
    } else {
        btn.innerHTML = 'stop';
        isPlay = true;
        $("#video").css({ visibility: 'hidden' })
        //  initMedia();
        mediaRecorder.start()
    }
})