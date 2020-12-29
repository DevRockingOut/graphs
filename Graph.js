/**
 * class Graph
 * 
 * @param {string} graph_id id of new graph
 * @param {number} container_id id of output container
 * @param {boolean} reset reset output container content
 * 
 * @constructor
 */
function Graph(graph_id, container_id){
    this.graph = []; // graph[node] = [] (array of edges) 
    this.nodes_components = [];
    this.edges_components = [];
    this.graph_component = new GraphComponent();
    this.graph_id = graph_id;
    this.container_id = container_id;

    this.edit = false;
    this.dragging = false;
    this.objectDrag = null;

    var component = this.graph_component.create(graph_id);
    this.render(container_id, component, true);
}


/**
 * Render html string 
 * @param {number} container_id id of output container (e.g. div)
 * @param {string} html_string string representation of html object
 * @param {boolean} reset reset output container content before rendering
 */
Graph.prototype.render = function(container_id, html_string, reset){
    var wrapper= document.createElement('div');
    wrapper.innerHTML= html_string;
    var htmlObject = wrapper.firstChild;

    if(reset){
        document.getElementById(container_id).innerHTML = "";
        document.getElementById(container_id).appendChild(htmlObject);
    }else{
        document.getElementById(container_id).appendChild(htmlObject);
    }
}

/**
 * Remove an element from page
 * @param {string} id id of element to remove
 */
Graph.prototype.remove = function(id){
    var elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
}


/**
 * Add new node to graph
 * @param {string} id node id
 */
Graph.prototype.addNode = function(id){
    var node = new NodeComponent();
    var component = node.create(id);
    this.nodes_components[id] = node;
    this.graph[id] = [];
    
    // TODO: calculate position in page where to put node
    this.render(this.graph_id, component, false);
}


/**
 * Add new edge to graph
 * @param {number} id edge id
 * @param {string} from_node origin node id
 * @param {string} to_node end node id
 * @param {number} edge_cost edge cost (distance)
 */
Graph.prototype.addEdge = function(id, from_node, to_node, edge_cost){
    var edge = new EdgeComponent();
    var component = edge.create(id, from_node, to_node, edge_cost);
    this.edges_components[id] = edge;
    this.graph[from_node].push({edge_id: id, from: from_node, to: to_node, cost: edge_cost});

    // TODO: calculate position in page where to put edge
    this.render(this.graph_id, component, false);
}


/**
 * Delete node from graph
 * @param {string} id node id
 */
Graph.prototype.deleteNode = function(id){
    this.nodes_components[id] = null;
    this.graph[id] = [];
    this.remove(id);
}


/**
 * Delete edge from graph
 * 
 * @param {number} id edge id
 * @param {string} from_node origin node id
 */
Graph.prototype.deleteEdge = function(id, from_node){
    this.edges_components[id] = null;

    // search for edge and remove it from array
    for(var i in this.graph[from_node]){
        if(this.graph[from_node][i].edge_id == id){
            // edge found
            this.graph[from_node].splice(i, 1);
            i = this.graph[from_node].length -1;
        }
    }

    this.remove(id);
}


/**
 * Delete graph instance
 */
Graph.prototype.deleteGraph = function(){
    for(var id in this.edges_components){
        this.deleteEdge(id, this.edges_components[id].from);
    }

    for(var i in this.nodes_components){
        this.deleteNode(this.nodes_components[i].id);
    }

    this.graph_component = null;
}


/**
 * Toogle edit mode
 * @param {boolean} edit edit mode
 */
Graph.prototype.enableEdit = function(edit){ this.edit = edit; }


/**
 * Public function used to drag/drop objects in graph
 * @param {event} e
 */
Graph.prototype.drag = function(e){
    console.log("s");
    alert(e.target.id);
    /*document.getElementById(this.graph_component.id).addEventListener("onclick", function(e){
        if(this.edit){
            if(this.dragging){ 
                // object already grab so drop
                this.dropObject(e);
            }else{
                this.dragObject(e);
            }
        }
    });*/
}


/**
 * Private function used to drag of html object
 * @param {event} e 
 */
Graph.prototype.dragObject = function(e){
    // detect if user is trying to drag a node
    var elem = document.elementFromPoint(e.clientX, e.clientY);
    if(elem && elem.className == "node"){
        this.objectDrag = elem.id;
        this.dragging = true;
    }
}


/**
 * Private function used to drop of html object
 * @param {event} e 
 */
Graph.prototype.dropObject = function(e){
    // detect if there is another element close
    var elem = document.elementFromPoint(e.clientX, e.clientY);
    this.objectDrag = null;
    this.dragging = false;
}