
////////////////////////////////////////////////////////////////////////////
    //panel resize scripts
////////////////////////////////////////////////////////////////////////////
var wrapper = document.querySelector('.space')
, box = null
, isHandlerDragging = false
, boxAminWidth = 60
, new_width = 0, current_width = 0

document.addEventListener('mousedown', function(e) {
  if (e.target.classList.contains('line')) {
    isHandlerDragging = true;
    box = e.target.previousElementSibling;
  }
  
});

document.addEventListener('mousemove', function(e) {
  if (!isHandlerDragging) {
    return false;
  }
  
     current_width = box.style.width;
  
 if ((new_width = e.clientX - box.offsetLeft - 8 ) >= boxAminWidth) {
     box.style.width = new_width + 'px';
 }
  if(wrapper.lastElementChild.offsetLeft + wrapper.lastElementChild.offsetWidth > wrapper.offsetWidth) {
  box.style.width = current_width;
  }

});

document.addEventListener('mouseup', function(e) {
  isHandlerDragging = false;
});

////////////////////////////////////////////////////////////////////////////