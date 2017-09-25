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
  set add/remove event in same block
  
  Collect Data--
  allSliders = all gallery sliders in the document
  container = the parent container block that contains everything
  box = the container block that contains the scrolling gallery
  boxW = box width
  sArr = array containing all slide objects within gallery
  sW = width of the individual slides in gallery
  sWm = width plus margin, used for desktop navigation
  sOffsetArr = array containing the pixel offset of each slide
  sImgArr = array containing each slides image object 

  Calculate on Scroll for each slide-- sAnimate()
  sPos = current slide position in box
  sPosVis = current slide position in visible portion of box
  sPosPct = convert position to percent, then apply to image
  scrPos = scroll position (position box is scrolled from TL zero)

  Mobile first, Desktop nav works on changing scroll via timer on click.
  timeOut = global conatiner for desktop nav values
  target = directs move() as to what gallery is assigned
  btnLeft, btnRigh = navigation elements

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
  // Desktop Navigation
  var timeOut = [];
  function move(box, sWm, sImgArr, direction, btnL, btnR, target) {
    if (direction === "right") {
      var scrollRt = box.scrollLeft + sWm;
      function moveScrollRt() {
        if (box.scrollLeft < scrollRt) {
          box.scrollLeft += 8;
          timeOut[target][1] = "moving";
          timeOut[target][0] = setTimeout(moveScrollRt, 10);
        } else {
          timeOut[target][1] = "done";
          return;
        }
      }
      if (box.scrollLeft === (sImgArr.length * sWm) - sWm * 2) {
        btnR.style.display = "none"; // hide btn after click of 2nd to last
      } else {
        btnL.removeAttribute("style");
      }
      if (timeOut[target][1] !== "done") {
        return;
      } else {
        moveScrollRt();
      }
    } else if (direction === "left") {
      var scrollLt = box.scrollLeft - sWm;
      function moveScrollLt() {
        if (box.scrollLeft > scrollLt) {
          box.scrollLeft -= 8;
          timeOut[target][1] = "moving";
          timeOut[target][0] = setTimeout(moveScrollLt, 10);
        } else {
          timeOut[target][1] = "done";
          return;
        }
      }
      if (box.scrollLeft === sWm) {
        btnL.style.display = "none"; // hide btn after back click on first
      } else {
        btnR.removeAttribute("style");
      }
      if (timeOut[target][1] !== "done") {
        return;
      } else {
        moveScrollLt();
      }
    }
  } //EOF
  function sAnimate(box, boxW, sW, sOffsetArr, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArr.length; i++) {
      var sPos = sOffsetArr[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image-slider-container");
  // For each individual gallery
  for (var j = 0; j < allSliders.length; j++) {
    let container = allSliders[j];
    let box = container.querySelector("div[class='image-slider']");
    let boxW = box.offsetWidth;
    let sArr = box.querySelectorAll("figure");
    let sW = box.querySelector("figure").offsetWidth;
    let sWm = box.querySelector("figure").offsetWidth + parseInt(getComputedStyle(box.querySelector("figure")).marginRight); // with margins
    let sOffsetArr = [];
    for (var i = 0; i < sArr.length; i++) {
      sOffsetArr.push(sArr[i].offsetLeft);
    }
    let sImgArr = box.querySelectorAll("figure img");
    box.setAttribute("class","image-slider");
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
    // Begin Desktop Specific
    timeOut.push([j,"done"]); // create global timeOut variables for desktop nav
    let target = j; // desktop nav target
    let btnLeft = container.querySelector("div[class='btn-slider btn-slider-l']");
    let btnRight = container.querySelector("div[class='btn-slider btn-slider-r']");
    btnLeft.style.display = "none"; // initial hide left
    let _forNavLeft = function() {
      move(box, sWm, sImgArr, "left", btnLeft, btnRight, target);
    }
    let _forNavRight = function() {
      move(box, sWm, sImgArr, "right", btnLeft, btnRight, target);
    }
    btnLeft.addEventListener("click", _forNavLeft);
    btnRight.addEventListener("click", _forNavRight);
    // End Desktop Specific
  }
} //EOF

// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider