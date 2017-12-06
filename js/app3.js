let $button, $img, imageCapture, mediaStreamTrack, $video;
var patch
$.get('patches/test3.pd', function(mainStr) {
	// Loading the patch
	patch = Pd.loadPatch(mainStr)
	Pd.start()
})
document.addEventListener('DOMContentLoaded', init, false);
function init() {

	$button = document.querySelector('#startVideoButton');
	$img = document.querySelector('#testImage');
	$video = document.querySelector('#testVideo');

	navigator.mediaDevices.getUserMedia({video: true})
	.then(setup)
	.catch(error => console.error('getUserMedia() error:', error));


}

function setup(mediaStream) {
	$video.srcObject = mediaStream;
	$img.addEventListener('load', getSwatches);

	mediaStreamTrack = mediaStream.getVideoTracks()[0];
	imageCapture = new ImageCapture(mediaStreamTrack);

	setInterval(getFrame,300);
}
function getFrame() {


		imageCapture.grabFrame()
		.then(blob => {
			//console.log('im in the got frame part');
			let $canvas = document.createElement('canvas');
			$canvas.width = blob.width;
			$canvas.height = blob.height;
			$canvas.getContext('2d').drawImage(blob, 0,0, blob.width, blob.height);

			$img.src = $canvas.toDataURL('image/png');
		});

}


function getSwatches() {

	let colorThief = new ColorThief();
	var colorArr = colorThief.getPalette($img, 5);
	var r,g,b,avg;
	var colorSum = 0;


	for (var i = 0; i < Math.min(5, colorArr.length); i++) {
		document.querySelector('#swatch'+i).style.backgroundColor = "rgb("+colorArr[i][0]+","+colorArr[i][1]+","+colorArr[i][2]+")";
		Pd.send('sampleinput', [parseFloat(colorArr[i][0])]);
		r = colorArr[i][0];
		g = colorArr[i][1];
		b = colorArr[i][2];
		avg = Math.floor((r+g+b)/3);
		colorSum += avg;
	}
	var brightness = Math.floor(colorSum / 5);
	//console.log(brightness);
}
