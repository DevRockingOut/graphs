/**
 * GraphComponent class
 * 
 * @constructor
 */
function GraphComponent(){
    this.id = null;
    this.interface = null;
}

/**
 * Returns html representation of graph
 * @param {Number} id id of new graph
 */
GraphComponent.prototype.createUI = function(id){
    this.id = id;
    this.interface = "<div id='" + id + "'>5103210991</div>";
    return this.interface;
}

/**
 * Delete html graph
 * @param {Number} id id of graph
 */
GraphComponent.prototype.deleteUI = function(id){
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}