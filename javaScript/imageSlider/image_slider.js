/*
  READ ME
  Multiple instances of slider may exist. Add css class 'image_slider' to gallery container.
  Attach imageSlider() to load event.
  Mobile gallery is horizontal, tablet and larger gallery is vertical.
  Animation is percentage based.
  convert to percentage, this is the value to move images within slide right or down
  move image to center using 1/2 image width/height, 50%
  To slow or speed image lag see: sPosPct = sPosPct * 0.20, 1 is full, 0 none
  Images should be large enough to fill lag distance within slide
  note: let not var, to prevent value from being replaced within block
  event listeners: '_forEventListener' solves the issue of passing parameters and removing event
  
  Collect Data--
  allSliders = all gallery sliders in the document
  box = the block element that contains the scrolling gallery items
  sArr = array containing all slide objects within gallery
  sImgArr = array containing each slides image object
  boxW/H box width/height
  sW/H = width/height of the individual slides in gallery
  sOffsetArrT/L = array containing the pixel offset of each slide

  Calculate on Scroll for each slide-- sAnimate()
  sPos = current slide position in box
  sPosVis = current slide position in visible portion of box
  sPosPct = convert position to percent, then apply to image
  scrPos = scroll position (position box is scrolled from TL zero)
*/

// Image Gallery Slider
function imageSlider(firstRun) {
  if (firstRun === true) {
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(function() {
        imageSlider();
      }, 400);
    });
    window.addEventListener("orientationchange", imageSlider);
  }
  function syAnimate(box, boxH, sH, sOffsetArrT, sImgArr) {
    var scrPos = box.scrollTop;
    // for each individual image slide
    for (var i = 0; i < sOffsetArrT.length; i++) {
      var sPos = sOffsetArrT[i] + (sH / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxH) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateY(" + sPosPct + "%)";
    }
  } //EOF
  function sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArrL.length; i++) {
      var sPos = sOffsetArrL[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image-slider");
  for (var j = 0; j < allSliders.length; j++) { // For each individual gallery element
    let box = allSliders[j]; // let so values aren't overwritten
    let sArr = box.querySelectorAll("figure");
    let sImgArr = box.querySelectorAll("figure img");
    // if horizontal/vertical scroll switch
    var flexDir = window.getComputedStyle(box).flexDirection;
    if (flexDir === "row") {
      box.scrollLeft = 0; // reset scroll to beginning
      var boxW = box.offsetWidth;
      var sW = box.querySelector("figure").offsetWidth;
      var sOffsetArrL = [];
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArrL.push(sArr[i].offsetLeft);
        sArr[i].removeAttribute("style");
      }
      var _forEventListener = function() {
        sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
      }
      sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
    } else if (flexDir === "column") {
      box.scrollTop = 0;
      var boxH = box.offsetHeight;
      var sH = box.querySelector("figure").offsetHeight;
      var sOffsetArrT = [];
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArrT.push(sArr[i].offsetTop);
        // Aspect ratio adjust
        var newHeight = parseInt(getComputedStyle(sArr[i]).width) * 0.66;
        newHeight = Math.round(newHeight);
        sArr[i].setAttribute("style", "height: " + newHeight + "px;");
      }
      var _forEventListener = function() {
        syAnimate(box, boxH, sH, sOffsetArrT, sImgArr);
      }
      syAnimate(box, boxH, sH, sOffsetArrT, sImgArr);
    } // End if else row/column
    box.addEventListener("scroll", _forEventListener);
    window.addEventListener("resize", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
    window.addEventListener("orientationchange", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
  } // End for
} //EOF
// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider