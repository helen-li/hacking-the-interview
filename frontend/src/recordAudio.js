import React from "react";

export default function recordAudio() {
    const record = document.querySelector('.record');
    const stop = document.querySelector('.stop');
    const soundClips = document.querySelector('.sound-clips');
    const mainSection = document.querySelector('.main-controls');

    // disable stop button while not recording

    stop.disabled = true;

    //main block for doing the audio recording

    if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        let chunks = [];

        let onSuccess = function (stream) {
            const mediaRecorder = new MediaRecorder(stream);

            record.onclick = function () {
                mediaRecorder.start();

                stop.disabled = false;
                record.disabled = true;
            }

            stop.onclick = function () {
                mediaRecorder.stop();
                mediaRecorder.requestData();

                stop.disabled = true;
                record.disabled = false;
            }

            mediaRecorder.onstop = function (e) {
                const clipName = prompt('Enter a name for your audio file:', 'newaudio');
                const audio = document.createElement('audio');
                audio.setAttribute('controls', '');

                audio.controls = true;
                const blob = new Blob(chunks, { 'type': 'audio/wav; codecs=opus' });
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;
                audio.download = 'test.wav';
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }
            mediaRecorder.start()
        }

        let onError = function (err) {
            console.log('The following error occured: ' + err);
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
        return (
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
        );

    } else {
        console.log('getUserMedia not supported on your browser!');
        return;
    }
}