function Draggable(){
    this.object = null;
}

Draggable.prototype.attachListeners = function(object){
    this.object = object;
    
    this.object.onmousedown = function(event) {
        // save ref to object dragged
        var object = this;

        // drag object from original click position (not always from center)
        var shiftX = event.clientX - object.getBoundingClientRect().left;
        var shiftY = event.clientY - object.getBoundingClientRect().top;

        // parent container position
        var parentPos = object.parentElement.getBoundingClientRect();
        //object.style.zIndex = 1000;
    
        if(object.style.position !== "absolute"){
            object.style.position = 'absolute';
        }

        moveAt(event.pageX, event.pageY);
      
        // moves the object at (pageX, pageY) coordinates, taking initial shifts into account
        function moveAt(pageX, pageY) {
            object.style.left = pageX - parentPos.left - shiftX + 'px';
            object.style.top = pageY - parentPos.top - shiftY + 'px';
        }
      
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
      
        // attach mousemove listener to object
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the object and detach its mousemove listener
        object.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            object.onmouseup = null;
        };
      
      };

    this.object.ondragstart = function() {
        return false;
    };
}