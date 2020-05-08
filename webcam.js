navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var video;
var webcamStream;

function startWebcam(){
	if (navigator.getUserMedia){
		navigator.getUserMedia(
			//constraints
			{
				video: true,
				audio: false
			},

			//successCallback
			function(localMediaStream){
				video = document.querySelector('video')
        video.srcObject = localMediaStream;
				//video.src = window.URL.createObjectURL(localMediaStream);
				webcamStream = localMediaStream;
			},

			//errorCallback
			function(err){
				console.log("The following error occured: "+err);
			}
		);
	} else {
		console.log("getUserMedia not supported");
	}
}

function stopWebcam(){
  webcamStream.getTracks().forEach(function(track){
    track.stop();
  });
	//webcamStream.stop();
}

//This code takes a snapshot
var canvas, ctx;
function init(){
	//Get the canvas and obtain a context for drawing in it
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext('2d');
}

function saveBase64AsFile(base64, fileName) {

    var link = document.createElement("a");

    link.setAttribute("href", base64);
    link.setAttribute("download", fileName);
    link.click();
}

function snapshot(){
	//Draws current image from the video element into the canvas
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	var dataURL = canvas.toDataURL();
	console.log(dataURL);
	//saveBase64AsFile(dataURL, "sample.jpg");
	console.log("Image saved");
}

makeblob = function (dataURL) {
	var BASE64_MARKER = ';base64,';
	if (dataURL.indexOf(BASE64_MARKER) == -1) {
		var parts = dataURL.split(',');
		var contentType = parts[0].split(':')[1];
		var raw = decodeURIComponent(parts[1]);
		return new Blob([raw], { type: contentType });
	}
	var parts = dataURL.split(BASE64_MARKER);
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], { type: contentType });
}
