// See read me in styles.css
/*
  READ ME
  imageSlider() is a standard function declaration, defined when executed via DOMContentLoaded.
  slideAnimation() only accessible from within imageSlider().
  If window is wider than total width of all slides function justifies slides and does not apply animation
  Animation is percentage based.

  To slow or speed image lag see: slidePosPct = slidePosPct * 0.XX, 1 is full, 0 none

  Images should be large enough to fill lag distance within slide

  Future additions: Add scroll stop then move image closest to center to center with 'transition-duration.'
*/
function imageSlider() {
  var imageSlider = document.getElementById('image_slider');
  var firstSlide = imageSlider.getElementsByTagName('div')[0];
  var slideWidth = firstSlide.offsetWidth;
  var slideMarWidth = parseInt(getComputedStyle(firstSlide).marginRight);
  var fullSlideWidth = slideWidth + slideMarWidth;
  var slideMarginRight = parseInt(getComputedStyle(firstSlide).marginRight);
  var imageSlidesArray = document.getElementsByClassName('image_slide');
  var imageWidth = firstSlide.getElementsByTagName('img')[0].offsetWidth;
  function slideAnimation() {
    var imageSliderWidth = imageSlider.offsetWidth;
    var scrollPos = imageSlider.scrollLeft;
    if (fullSlideWidth * (imageSlidesArray.length - 1) <= imageSliderWidth ) {
      image_slider.setAttribute('class','justified');
    } else {
      for (var i = 0; i < imageSlidesArray.length; i++) {
        var slide = imageSlidesArray[i];
        //current slides center, distance from SCROLLER containers left side
        var slidePos = Math.round(imageSlidesArray[i].offsetLeft + (fullSlideWidth / 2) );
        //current slides center position IN CONTAINER
        var slidePosIn = scrollPos - slidePos;
        //convert to percentage, this is value to move images within slide right
        var slidePosPct = Math.round((slidePosIn / imageSliderWidth) * 100);
        //move image to center using 1/2 image width which is 50%
        slidePosPct = slidePosPct + 50;
        //finally... SLOW down image movement by cutting down slide pos percentage
        slidePosPct = slidePosPct * 0.20;
        moveMe = slidePosPct;
        imageSlidesArray[i].getElementsByTagName('img')[0].style.transform = 'translateX(' + moveMe + '%)';
      }
    }
  }
  imageSlider.addEventListener('scroll', slideAnimation);
}; //EOF
//initialize image slider, call function when DOMContentLoaded
window.document.addEventListener('DOMContentLoaded', imageSlider);
//initialize image slider if window resized or orientation change
window.document.addEventListener('onresize', imageSlider);
window.document.addEventListener('orientationchange', imageSlider);