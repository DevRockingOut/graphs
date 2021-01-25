function Draggable(){
    this.object = null;
}

Draggable.prototype.attachListeners = function(object, notify){
    this.object = object;
    
    this.object.onmousedown = function(event) {
        // save ref to object dragged
        var object = this;

        var scaleX = object.getBoundingClientRect().width / object.clientWidth;
        var scaleY = object.getBoundingClientRect().height / object.clientHeight;

        // drag object from click position (not always from center)
        var shiftX = event.clientX - object.getBoundingClientRect().left + (object.getBoundingClientRect().width * scaleX);
        var shiftY = event.clientY - object.getBoundingClientRect().top + (object.getBoundingClientRect().height * scaleY);

        // parent container position
        var parentPos = object.parentElement.getBoundingClientRect();
        //object.style.zIndex = 1000;
    
        if(object.style.position !== "absolute"){
            object.style.position = 'absolute';
        }

        moveAt(event.pageX, event.pageY);
      
        // moves the object at (pageX, pageY) coordinates, taking initial shifts into account
        function moveAt(pageX, pageY) {
            var x = pageX - parentPos.left - shiftX;
            var y = pageY - parentPos.top - shiftY;

            object.style.left = x + 'px';
            object.style.top = y + 'px';

            if(notify != undefined){
                notify(object);
            }
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