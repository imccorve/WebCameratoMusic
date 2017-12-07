let $button, $img, imageCapture, mediaStreamTrack, $video;
var patch
$.get('patches/testing/errorcheck.pd', function(mainStr) {
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

	//Determine color to be sent
	var red = 0;
	var orange = 1;
	var yellow = 2;
	var yellow_green = 3;
	var green = 4;
	var cyan = 5;
	var it_blue = 6;
	var dk_purple = 8;
	var purple = 9;
	var pink = 10;
	var magenta = 11;

	for (var i = 0; i < Math.min(5, colorArr.length); i++) {
		document.querySelector('#swatch'+i).style.backgroundColor = "rgb("+colorArr[i][0]+","+colorArr[i][1]+","+colorArr[i][2]+")";


		//Pd.send('color' + i, [parseFloat(colorArr[i][0])])

		console.log(colorArr[i][0]);
		//Pd.send('g' + i, [parseFloat(colorArr[i][1])]);
		//Pd.send('b' + i, [parseFloat(colorArr[i][2])]);

		r = colorArr[i][0];
		g = colorArr[i][1];
		b = colorArr[i][2];
		avg = Math.floor((r+g+b)/3);
		colorSum += avg;
	}
	Pd.send('redone', [parseFloat(colorArr[0][0])]);
	Pd.send('greenone',[parseFloat(colorArr[0][1])]);
	Pd.send('blueone',[parseFloat(colorArr[0][2])]);

	Pd.send('redtwo', [parseFloat(colorArr[1][0])]);
	Pd.send('greentwo',[parseFloat(colorArr[1][1])]);
	Pd.send('bluetwo',[parseFloat(colorArr[1][2])]);

	Pd.send('redthree', [parseFloat(colorArr[2][0])]);
	Pd.send('greenthree',[parseFloat(colorArr[2][1])]);
	Pd.send('bluethree',[parseFloat(colorArr[2][2])]);

	Pd.send('redfour', [parseFloat(colorArr[3][0])]);
	Pd.send('greenfour',[parseFloat(colorArr[3][1])]);
	Pd.send('bluefour',[parseFloat(colorArr[3][2])]);

	Pd.send('redfive', [parseFloat(colorArr[4][0])]);
	Pd.send('greenfive',[parseFloat(colorArr[4][1])]);
	Pd.send('bluefive',[parseFloat(colorArr[4][2])]);

	var brightness = Math.floor(colorSum / 5);
	//console.log(brightness);
}
