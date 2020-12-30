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
    this.nodes_count = 0;
    this.edges_count = 0;

    this.graph_component = new GraphComponent();
    this.graph_id = graph_id;
    this.container_id = container_id;

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
Graph.prototype.addNode = function(id, x, y){
    var node = new NodeComponent();
    node.updatePosition(x, y);

    var component = node.create(id);
    this.nodes_components[id] = node;
    this.graph[id] = [];
    
    this.render(this.graph_id, component, false);

    var node_el = document.getElementById(id);
    
    var draggable = new Draggable();
    draggable.attachListeners(node_el);
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
    this.nodes_count -= 1;
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
    this.edges_count -= 1;
}


/**
 * Delete graph contents
 */
Graph.prototype.deleteGraph = function(){
    for(var id in this.edges_components){
        this.deleteEdge(id, this.edges_components[id].from);
    }

    for(var i in this.nodes_components){
        this.deleteNode(this.nodes_components[i].id);
    }

    this.nodes_components = [];
    this.edges_components = [];
    this.graph = [];
}


/**
 * Public function used to drag/drop objects in graph
 * @param {event} e
 */
Graph.prototype.click = function(e){
    
    if(e.target.id == this.graph_id){
        // create new node
        var node_name = "N" + (++this.nodes_count);
        console.log(e.currentTarget.id);
        var parentPosition = this.getPosition(e.currentTarget);
        var node_width = 58;  // To change later for responsiveness
        var x = e.clientX - parentPosition.x - (node_width / 2);
        var y = e.clientY - parentPosition.y - (node_width / 2);

        this.addNode(node_name, x, y);
        
        var node = document.getElementById(node_name);
    
        // enable drag/drop for node
        var draggable = new Draggable();
        draggable.attachListeners(node);
    } 
}


/**
 * Helper function to get an element's exact position
 * @param {any} obj Object to move
 */
Graph.prototype.getPosition = function(obj){
    var xPos = 0;
    var yPos = 0;

    while (obj) {
        if (obj.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = obj.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = obj.scrollTop  || document.documentElement.scrollTop;

            xPos += (obj.offsetLeft - xScroll + obj.clientLeft);
            yPos += (obj.offsetTop - yScroll + obj.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (obj.offsetLeft - obj.scrollLeft + obj.clientLeft);
            yPos += (obj.offsetTop - obj.scrollTop + obj.clientTop);
        }

        obj = obj.offsetParent;
    }

    return { x: xPos, y: yPos };
}