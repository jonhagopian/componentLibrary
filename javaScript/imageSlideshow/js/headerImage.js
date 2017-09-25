/*
	Swaps banner images at timed intervals from json, then choosing at random.
	*batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/

function hdrImg() {

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    var hdrImgArray = JSON.parse(this.responseText);
	    document.getElementById("demo").innerHTML = myObj.name;
	  }
	};
	xmlhttp.open("GET", "js/bannerImages.json", true);
	xmlhttp.send();

	/*var hdrImgArray = [
		"images/banff1.jpg",
		"images/banff2.jpg",
		"images/banff3.jpg",
		"images/banff4.jpg",
		"images/banff5.jpg",
		"images/banff6.jpg",
		"images/banff7.jpg",
		"images/banff8.jpg"
	]*/
	function swapHdrImg() {
		randomImg = hdrImgArray[Math.floor(Math.random() * hdrImgArray.length)];
		newBannerImage = document.createElement("img");
		newBannerImage.src = randomImg;
		newBannerImage.onload = function() {
			imageBnrBox.appendChild(newBannerImage);
			var flowFix = newBannerImage.offsetWidth; // see note: *
				newBannerImage.style.opacity = 1;
		}
	} // EOF
	var randomImg = hdrImgArray[Math.floor(Math.random() * hdrImgArray.length)];
	imageBnrBox = document.getElementById("header-image");
	var headlineTimer = setInterval(swapHdrImg, 5000);
	swapHdrImg();
}
window.addEventListener("load", function() {
  hdrImg();
});