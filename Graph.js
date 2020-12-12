/**
 * class Graph
 * 
 * @constructor
 */
function Graph(id){
    this.nodes_components = [];
    this.edges_components = [];
    this.graph_component = new GraphComponent();
    this.id = id;
    this.graph_component.create(id);
}

Graph.prototype.addNode = function(id){
    var node = new NodeComponent();
    var component = node.create(id);
    this.nodes_components.push(node);

    // TODO: calculate position in page where to put node
    document.getElementById(this.id).appendChild(component);
}

Graph.prototype.addEdge = function(id){
    var edge = new EdgeComponent();
    var component = edge.create(id);
    this.edges_components.push(edge);

    // TODO: calculate position in page where to put edge
    document.getElementById(this.id).appendChild(component);
}

Graph.prototype.deleteNode = function(id, node_index){
    this.graph_component.delete(id);

    if(node_index != null){
        // remove edge
        this.nodes_components.splice(node_index, 1); 
    }else{
        // search for edge and remove it from array
        for(var i in this.nodes_components){
            if(this.nodes_components[i].id == id){
                // edge found
                this.nodes_components.splice(i, 1);
                i = this.nodes_components.length -1;
            }
        }
    }
}

Graph.prototype.deleteEdge = function(id, edge_index){
    this.graph_component.delete(id);

    if(edge_index != null){
        // remove edge
        this.edges_components.splice(edge_index, 1); 
    }else{
        // search for edge and remove it from array
        for(var i in this.edges_components){
            if(this.edges_components[i].id == id){
                // edge found
                this.edges_components.splice(i, 1);
                i = this.edges_components.length -1;
            }
        }
    }
}

Graph.prototype.deleteGraph = function(){
    for(var i in this.edges_components){
        Graph.deleteEdge(this.edges_components[i].id, i);
    }

    for(var i in this.nodes_components){
        Graph.deleteNode(this.nodes_components[i].id, i);
    }
}