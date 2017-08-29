/*
  READ ME
  Multiple instances of slider may exist. Add css class 'image_slider' to gallery container.
  Attach imageSlider() to load event.
  If window is wider than total width of all slides, script will justify slides without animation.
  Animation is percentage based.
  slide center, distance from SCROLLER container left side
  slide center, position IN CONTAINER
  convert to percentage, this is the value to move images within slide right
  move image to center using 1/2 image width, 50%
  To slow or speed image lag see: sPosPct = sPosPct * 0.20, 1 is full, 0 none
  Images should be large enough to fill lag distance within slide
  note: let not var, to prevent value from being replaced
  event listeners: '_forEventListener' solves the issue of passing parameters and removing event
    setting add/remove event in same block
  
  Future additions: Previous/Next buttons to clue user?

  Collect Data--
  allSliders = all gallery sliders in the document
  box = the parent container block that contains the scrolling gallery
  boxW = box width
  sArr = array containing all slide objects within gallery
  sW = width of the individual slides in gallery
  sOffsetArr = array containing the pixel offset of each slide
  sImgArr = array containing each slides image object 

  Calculate on Scroll for each slide-- sAnimate()
  sPos = current slide position in box
  sPosVis = current slide position in visible portion of box
  sPosPct = convert position to percent, then apply to image
  scrPos = scroll position (position box is scrolled from TL zero)

  See read me in styles.css
*/

// Image Gallery Slider
function imageSlider(firstRun) {
  if (firstRun === true) {
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(function() {
        imageSlider();
      }, 200);
    });
    window.addEventListener("orientationchange", imageSlider);
  }
  function sAnimate(box, boxW, sW, sOffsetArr, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArr.length; i++) {
      var sPos = sOffsetArr[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100;
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image_slider");
  // For each individual gallery
  for (var j = 0; j < allSliders.length; j++) {
    let box = allSliders[j];
    let boxW = box.offsetWidth;
    let sArr = box.querySelectorAll("figure");
    let sW = box.querySelector("figure").offsetWidth;
    let sOffsetArr = [];
    sArr.forEach(function(item){
      sOffsetArr.push(item.offsetLeft)
    });
    let sImgArr = box.querySelectorAll("figure img");
    // If screen is too wide, no slider
    if (box.scrollWidth <= boxW) {
      box.setAttribute("class","image_slider justified");
      box.scrollLeft = 0;
      for (var i = 0; i < sImgArr.length; i++) {
        sImgArr[i].style.transform = "translateX(0%)";
      }
    } else {
      box.setAttribute("class","image_slider");
      let _forEventListener = function() {
        sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
      }
      box.addEventListener("scroll", _forEventListener);
      window.addEventListener("resize", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      window.addEventListener("orientationchange", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
    }
  }
} //EOF

// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider