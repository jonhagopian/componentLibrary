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

  Future additions: Previous/Next buttons to clue user?

  note: let not var, to prevent value from being replaced
  
  Collect Data--
  allSliders = all gallery sliders in the document
  box = the parent container block that contains the scrolling gallery
  boxW = box width
  s0 = first slide, used to reference
  sW = width of the individual slides in gallery
  sMR = width of the margin used on each slide, currently margin right
  sF = width of the individual slide plus margin right
  sArr = array containing all slide objects within gallery
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
    // Re-init slider
    window.addEventListener("resize", imageSlider);
    window.addEventListener("orientationchange", imageSlider);
  }
  function sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr) {
    var scrPos = box.scrollLeft;
    for (var i = 0; i < sOffsetArr.length; i++) {
      var sPos = sOffsetArr[i] + ((sW+sMR) / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100;
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // slow image movement by reducing this %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image_slider");
  // For each individual slider 'section' element
  for (var j = 0; j < allSliders.length; j++) {
    let box = allSliders[j];
    let boxW = box.offsetWidth;
    let s0 = box.querySelector("div");
    let sW = s0.offsetWidth;
    let sMR = parseFloat(getComputedStyle(s0).marginRight);
    let sF = sW + sMR;
    let sArr = box.querySelectorAll(".image_slide");
    // If screen is too wide, no need to run slider
    if (sF * (sArr.length - 1) <= boxW) {
      box.setAttribute("class","image_slider justified");
      box.scrollLeft = 0;
    } else {
      box.setAttribute("class","image_slider");
      let sOffsetArr = [];
      let sImgArr = [];
      // For each individual slide within the parent slider
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArr.push(sArr[i].offsetLeft);
        sImgArr.push(sArr[i].querySelector("img"));
      }
      box.addEventListener("scroll", function() {
        sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr);
      });
      sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr);
    }
  }
} //EOF

// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider