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
    this.component = "<div id='" + name + "' class='node' style='left: " + this.position.x + "; top: " + this.position.y + ";'>" + name + "</div>";
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