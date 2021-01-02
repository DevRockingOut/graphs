/**
 * EdgeComponent class
 * 
 * @constructor
 */
function EdgeComponent(){
    this.id = null;
    this.component = null;
    this.from = null;
    this.to = null;
    this.cost = null;
}

/**
 * Returns html representation of edge
 * @param {Number} id id of new edge
 */
EdgeComponent.prototype.create = function(id, from, to, cost){
    this.id = id;
    this.from = from;
    this.to = to;
    this.cost = cost;
    this.component = "<div id='" + id + "' class='edge'></div>";
    return this.component;
}