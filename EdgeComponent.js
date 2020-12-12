/**
 * EdgeComponent class
 * 
 * @constructor
 */
function EdgeComponent(){
    this.id = null;
    this.interface = null;
    this.from = null;
    this.to = null;
    this.cost = null;
}

/**
 * Returns html representation of edge
 * @param {Number} id id of new edge
 */
EdgeComponent.prototype.createUI = function(id){
    this.id = id;
    this.interface = "<div id='" + id + "'>5103210991</div>";
    return this.interface;
}

/**
 * Delete html edge
 * @param {Number} id id of edge
 */
EdgeComponent.prototype.deleteUI = function(id){
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}