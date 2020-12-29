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
    this.calculatePosition();
    this.component = "<div id='" + name + "' class='node' style='width: " + this.position.x + "; height: " + this.position.y + ";'>" + name + "</div>";
    return this.component;
}

NodeComponent.prototype.calculatePosition = function(){
    var position = {x: "50px", y: "50px"};
    this.position = position;
    return position;
}