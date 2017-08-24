// See read me in styles.css
/*
  READ ME
  Multiple instances of slider may exist. Add css class 'image_slider' to gallery container.
  imageSlider() run via 'load' event.
  If window is wider than total width of all slides function justifies slides without animation.
  Animation is percentage based.

  current slide center, distance from SCROLLER container left side
  current slide center position IN CONTAINER
  convert to percentage, this is the value to move images within slide right
  move image to center using 1/2 image width which is 50%

  To slow or speed image lag see: sPosPct = sPosPct * 0.XX, 1 is full, 0 none

  Images should be large enough to fill lag distance within slide

  Future additions: Previous/Next buttons for desktop.

  Variable: (let box is used to prevent variable hoisting within 'for' and 'while' loops)
  box = the parent container block containing scrolling gallery
  s0 = current slide object
  sW = slide width
  sF = slide dimensions plus margin right
  sArr = array, all slides within the box

  boxW = box width
  scrPos = scroll position (position box is scrolled from TL zero)
  sPos = current slide position in box
  sPosVis = current slide position in visible portion of box
  sPosPct = convert position to percent
*/
// Image Slider
function sAnimate(box) {
  var s0 = box.getElementsByTagName("div")[0];
  var sW = s0.offsetWidth;
  var sF = sW + parseInt(getComputedStyle(s0).marginRight);
  var sArr = box.querySelectorAll(".image_slide");
  var boxW = box.offsetWidth;
  var scrPos = box.scrollLeft;
  if (sF * (sArr.length - 1) <= boxW) {
    box.scrollLeft = 0;
    box.setAttribute("class","image_slider justified");
  } else {
    box.setAttribute("class","image_slider");
    for (var i = 0; i < sArr.length; i++) {
      var sPos = Math.round(sArr[i].offsetLeft + (sW / 2) + (parseInt(getComputedStyle(s0).marginRight) / 2));
      var sPosVis = scrPos - sPos;
      var sPosPct = Math.round((sPosVis / boxW) * 100);
      sPosPct = sPosPct + 50;
      sPosPct = sPosPct * 0.20; // slow image movement by reducing this %
      sArr[i].querySelector("img").style.transform = "translateX(" + sPosPct + "%)";
    }
  }
}
function imageSlider() {
  var allSliders = document.querySelectorAll(".image_slider");
  for (var i = 0; i < allSliders.length; i++) {
    let box = allSliders[i]; // let won't allow value to be overwritten by each iteration
    box.addEventListener("scroll", function() {
      sAnimate(box);
    });
    sAnimate(box);
  };
}; //EOF
//init slider
window.addEventListener("load", imageSlider);
//re-init slider
window.addEventListener("resize", imageSlider);
window.addEventListener("orientationchange", imageSlider);
// End Image Slider