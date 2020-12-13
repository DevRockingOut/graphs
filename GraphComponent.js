/**
 * GraphComponent class
 * 
 * @constructor
 */
function GraphComponent(id){
    this.id = id;
    this.component = null;
}

/**
 * Returns html representation of graph
 * @param {Number} id id of new graph
 */
GraphComponent.prototype.create = function(id){
    this.id = id;
    this.component = "<div id='" + id + "'></div>";
    return this.component;
}

/**
 * Delete html graph
 * @param {Number} id id of graph
 */
GraphComponent.prototype.delete = function(id){
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}