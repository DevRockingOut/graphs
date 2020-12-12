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
EdgeComponent.prototype.create = function(id){
    this.id = id;
    this.component = "<div id='" + id + "'>5103210991</div>";
    return this.component;
}