/**
 * NodeComponent class
 * 
 * @constructor
 */
function NodeComponent(){
    this.id = null;
    this.component = null;
    this.name = null;
    this.position = { x:"0px", y:"0px" };
}

/**
 * Returns html representation of node
 * @param {string} name name of new node
 */
NodeComponent.prototype.create = function(name){
    this.id = name;
    this.name = name;

    this.component = '<svg width="200" height="200" id ="'+name+'" class="node" style="left: ' + this.position.x + '; top: ' + this.position.y + ';" onclick="nodeClick(this.id)"> ';
    this.component += '<g><circle cx="100" cy="100" r="80" fill="red" />';
    this.component += '<text x="50%" y="50%" text-anchor="middle" dy=".3em" class="textSvg">'+name+'</text></g>';
    this.component += '<path class="path1" d="M 20 100 A 80 80 0 0 1 180 100" fill ="none"  stroke="black" stroke-width="4" />';
    this.component += '<path class="path2" d="M 180 100 A 80 80 0 0 1 20 100" fill ="none"  stroke="black" stroke-width="4" />';
    this.component += '</svg>';
  
    return this.component;
}

/**
 * Updates the position of node in graph
 * @param {number} px x position of node
 * @param {number} py y position of node
 */
NodeComponent.prototype.updatePosition = function(px, py){
    var position = {x: px + "px", y: py + "px"};
    var node = document.getElementById(this.id);

    if(node){
        node.style.left = position.x;
        node.style.top = position.y;
    }

    this.position = position;

    return position;
}