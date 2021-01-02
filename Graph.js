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
 * Public function used to handle click of objects in graph
 * @param {event} e
 */
Graph.prototype.click = function(e){
    if(simulation.add_node && e.target.id == this.graph_id){
        // create new node
        var node_name = "N" + (++this.nodes_count);
        var parentPosition = this.getPosition(e.currentTarget);
        var node_width = 200;  // To change later for responsiveness
        var x = e.clientX - parentPosition.x - (node_width / 2);
        var y = e.clientY - parentPosition.y - (node_width / 2);

        this.addNode(node_name, x, y);
        
        var node = document.getElementById(node_name);
    
        document.getElementById("editNodeDialog").style.display = "none";

        // enable drag/drop for node
        var draggable = new Draggable();
        draggable.attachListeners(node);

    } else if(simulation.add_edge && e.target.closest(".node")){ // this finds closest element with class node
       var node = e.target.closest(".node");

       if(simulation.new_edge.from == undefined){
            simulation.new_edge.from = node.id;
       }else {
            simulation.new_edge.to = node.id;

            var node_from = document.getElementById(simulation.new_edge.from);
            var left = node_from.style.left.replace("px","");
            var width = node_from.clientWidth;
            var top = node_from.style.top.replace("px","");
            var height = node_from.clientHeight;

            var center_x = parseInt(left) + width/2;
            var center_y = parseInt(top) + height/2;

            console.log(node_from);
            console.log(center_x);
            console.log(center_y);
            console.log("left: " + left + "   width: " + width);
            console.log("top: " + left + "   height: " + width);


            // normalement on devrait pouvoir faire node.offsetLeft

            // create new edge
            this.addEdge(++this.edges_count, simulation.new_edge.from, simulation.new_edge.to, 1);

            var edge = document.getElementById(this.edges_count);
            edge.style.left = center_x;
            edge.style.top = center_y;

            // so lets try get something else

            // but wait first lets try without div
            
       }

    } else {
        // check if closest parent element has class node or edges
        var node = e.target.closest(".node");
        var edge = e.target.closest(".edges");
        
        if(node){
            // add nodes options (add edge -> from/to)
            var node = document.getElementById(simulation.selected_node).getBoundingClientRect();
            var dialog = document.getElementById("editNodeDialog");

            dialog.style.display = "block";
            dialog.style.left = node.left + node.width + "px";
            dialog.style.top = node.top + "px";

            var input = dialog.querySelector("#changeName");
            input.value = simulation.selected_node;
            var that = this;
            input.addEventListener("change", function(){ 
                that.nodes_components[simulation.selected_node].name = input.value;
                document.getElementById(simulation.selected_node).querySelector(".textSvg").innerHTML = input.value;
            });
            
        } else if(edge){
            // add nodes options (change node name, change edge -> from/to)
            document.getElementById("editNodeDialog").style.display = "none";
        }
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

Graph.prototype.animate = function(node){
    console.log("here");
    if(simulation.pause){
        // pause animation
        var path1 = document.querySelectorAll(".path1");
        var path2 = document.querySelectorAll(".path2");
        
        for(var i = 0; i < path1.length; i++){
            /*var computedStyle = window.getComputedStyle(path1[i]);
            var computedStyle2 = window.getComputedStyle(path2[i]);

            var dashArray = computedStyle.getPropertyValue('stroke-dasharray');
            var dashOffset = computedStyle.getPropertyValue('stroke-dashoffset');
            var dashArray2 = computedStyle2.getPropertyValue('stroke-dasharray');
            var dashOffset2 = computedStyle2.getPropertyValue('stroke-dashoffset');

            path1[i].style.strokeDasharray = dashArray;
            path1[i].style.strokeDashoffset = dashOffset;
            path2[i].style.strokeDasharray = dashArray2;
            path2[i].style.strokeDashoffset = dashOffset2;*/
             
            if (path1[i].style.webkitAnimationPlayState == 'running' || path1[i].style.webkitAnimationPlayState == '') {
                path1[i].style.webkitAnimationPlayState = 'paused';
                path2[i].style.webkitAnimationPlayState = 'paused';
            }
        }

    }else if(simulation.play){
        // play animation
        if(node){
            var path1 = node.querySelector(".path1");
            var path2 = node.querySelector(".path2");

            if(path1.style.webkitAnimationPlayState == "paused"){
                // resume animation
                path1.style.webkitAnimationPlayState = "running";
                path2.style.webkitAnimationPlayState = "ru  nning";
            }else{
                // play new animation
                path1.classList.add("animate");
                path2.classList.add("animate");
            }
        }else{
            console.log("1");
            for(var id in this.nodes_components){
                var path1 = document.getElementById(id).querySelector(".path1");
                var path2 = document.getElementById(id).querySelector(".path2");

                if(path1.style.webkitAnimationPlayState == "paused"){
                    // resume animation
                    path1.style.webkitAnimationPlayState = "running";
                    path2.style.webkitAnimationPlayState = "running";
                    console.log("2");
                }else{
                    // play new animation
                    path1.classList.add("animate");
                    path2.classList.add("animate");
                    setTimeout(function(){
                        path2.classList.add("dashoffset");
                    }, 380);
                    console.log("3");
                }
            }
            
        }
    }else if(simulation.replay){
        //var animate = document.querySelector(".animate");
        var path1 = document.querySelector(".path1");
        var path2 = document.querySelector(".path2");

        path1.classList.remove("animate");
        path2.classList.remove("animate");
        path1.classList.add("initial");
        path2.classList.add("initial");

        setTimeout(function(){
            path1.classList.add("animate");
            path2.classList.add("animate");

            path1.style.webkitAnimationPlayState = "running";
            path2.style.webkitAnimationPlayState = "running";

            path1.classList.remove("initial");
            setTimeout(function(){
                path2.classList.remove("initial");
            }, 380);
        }, 10);

        /*for(var i = 0; i < animate.length; i++){
            animate[i].style.webkitAnimationName = "none";

            animate[i].classList.remove("animate");
            animate[i].classList.remove("dashoffset");
        }

        var that = this;
        setTimeout(function() {
            simulation.play = true;
            that.animate();
        }, 10);*/
    }
}