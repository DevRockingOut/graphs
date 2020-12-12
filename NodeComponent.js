/**
 * NodeComponent class
 * 
 * @constructor
 */
function NodeComponent(){
    this.id = null;
    this.component = null;
    this.name = null;
}

/**
 * Returns html representation of node
 * @param {Number} id id of new node
 */
NodeComponent.prototype.create = function(id){
    this.id = id;
    this.component = "<div id='" + id + "'>5103210991</div>";
    return this.component;
}