/**
 * NodeComponent class
 * 
 * @constructor
 */
function NodeComponent(){
    this.id = null;
    this.interface = null;
    this.name = null;
}

/**
 * Returns html representation of node
 * @param {Number} id id of new node
 */
NodeComponent.prototype.createUI = function(id){
    this.id = id;
    this.interface = "<div id='" + id + "'>5103210991</div>";
    return this.interface;
}

/**
 * Delete html node
 * @param {Number} id id of node
 */
NodeComponent.prototype.deleteUI = function(id){
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}