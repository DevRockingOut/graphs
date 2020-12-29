var G = G || {};
G.H = [];
G.graph = [];
G.start_node = "a";
G.end_node = "k";

G.parseHeuristics = function(heuristics){
    var H_arr = heuristics.split("\n");
    
    for(var i in H_arr){
        var parts = H_arr[i].split("=");
        var name = parts[0].replace("H(", "").replace(")", "").trim();

        G.H[name] = parseInt(parts[1]);
    }
}

G.parseGraph = function(value){
    var arr = [];

    G.graph = [];
    arr = value.split("\n");

    for(var i in arr){
        var edge = arr[i].split(",");
        var node_from =  edge[0].trim();

        if(G.graph[node_from]){
            G.graph[node_from].push({
                node_to: edge[1].trim(),
                cost: parseInt(edge[2].trim())
            });
        }else{
            G.graph[node_from] = [{
                node_to: edge[1].trim(),
                cost: parseInt(edge[2].trim())
            }];
        }
    }
}

G.BestFirstSearch = function(){
    // saved frontier for print
    var frontier_trace = [];

    var current_node = G.start_node;
    frontier_trace.push(current_node);

    while(current_node != G.end_node && current_node != null){
        // add node to frontier
        //frontier_trace.push(current_node);
        var children = G.graph[current_node];
        
        // add child nodes to frontier
        var min_child = null;
       
        if(children != null) {
            min_child = children[0];
        }

        for(var i in children){
            if(!frontier_trace.includes(children[i].node_to)){
                frontier_trace.push(children[i].node_to);
            }

            if(children[i].node_to == G.end_node){
                min_child = children[i];
                break;
            }else if(G.H[children[i].node_to] < G.H[min_child.node_to]){
                min_child = children[i];
            }
        }

        if(min_child != null){
            current_node = min_child.node_to;
        }else{
            current_node = null;
        }
    }

    if(!frontier_trace.includes(current_node)){
        frontier_trace.push(current_node);
    }

    var s = "BestFirstSearch - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.BreadthFirstSearch = function(){
    // saved frontier for print
    var frontier_trace = [];

    // frontier as queue
    var frontier = [];

    // add starting node to frontier
    frontier_trace.push(G.start_node);
    frontier.push(G.start_node);

    var current_node = "";
    while(current_node != G.end_node){
        // remove first node
        current_node = frontier.shift();
       
        var children = G.graph[current_node];

        // add child nodes to frontier
        for(var i in children){
            // add only if node was not already visited
            if(!frontier_trace.includes(children[i].node_to)){
                frontier_trace.push(children[i].node_to);
                frontier.push(children[i].node_to);
            }
        }
    }

    var s = "BreadthFirstSearch - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.DepthFirstSearch = function(){
    // saved frontier for print
    var frontier_trace = [];

    // frontier as stack
    var frontier = [];

    // add starting node to frontier
    frontier_trace.push(G.start_node);
    frontier.push(G.start_node);

    var current_node = "";
    while(current_node != G.end_node){
        // remove last node
        current_node = frontier.pop();
       
        var children = G.graph[current_node];

        // add child nodes to frontier
        for(var i in children){
            // add only if node was not already visited
            if(!frontier_trace.includes(children[i].node_to)){
                frontier_trace.push(children[i].node_to);
                frontier.push(children[i].node_to);
            }
        }
    }

    var s = "DepthFirstSearch - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.LowestCostFirstSearch = function(){
    var graph_copy = G.graph;

    // saved frontier for print
    var frontier_trace = [];

    var frontier = PriorityQueue();

    var current_node = G.start_node;

    // add starting node to frontier
    frontier_trace.push(G.start_node);
    frontier.enqueue(G.start_node, 0);

    var current_node = "";
    while(current_node != G.end_node){
        // remove node
        current_node = frontier.dequeue();
   
        var children = graph_copy[current_node];
        
        // add child nodes to frontier
        for(var i in children){
            
            // add only if node was not already visited
            if(!frontier_trace.includes(children[i].node_to)){
                frontier_trace.push(children[i].node_to);
                
                //console.log(current_node + "   " + children[i].node_to);

                frontier.enqueue(children[i].node_to, children[i].cost);

                // update paths cost
                var next_children = graph_copy[children[i].node_to];
                for(var j in next_children){
                    next_children[j].cost = children[i].cost + next_children[j].cost;
                }

            }
        }
    }

    var s = "LowestCostFirstSearch - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.GreedySearch = function(){
    // saved frontier for print
    var frontier_trace = [];

    var current_node = G.start_node;
    while(current_node != G.end_node && current_node != null){
        // add node to frontier
        frontier_trace.push(current_node);
        var children = G.graph[current_node];
        
        // add child nodes to frontier
        var min_child = null;
       
        if(children != null) {
            min_child = children[0];
        }

        if(min_child == null) console.log(current_node);

        for(var i in children){
            if(children[i].node_to == G.end_node){
                min_child = children[i];
                break;
            }else if(children[i].cost < min_child.cost){
                min_child = children[i];
            }
        }

        if(min_child != null){
            current_node = min_child.node_to;
        }else{
            current_node = null;
        }
    }

    if(!frontier_trace.includes(current_node)){
        frontier_trace.push(current_node);
    }

    var s = "Greedy Search - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.AStarSearch = function(){
    var graph_copy = G.graph;

    // saved frontier for print
    var frontier_trace = [];

    var frontier = PriorityQueue();

    var current_node = G.start_node;

    // add starting node to frontier
    frontier_trace.push(G.start_node);
    frontier.enqueue(G.start_node, 0);

    var current_node = "";
    while(current_node != G.end_node){
        // remove node with lowest cost
        current_node = frontier.dequeue();
        
        var children = graph_copy[current_node];
        
        // add child nodes to frontier
        for(var i in children){
            
            // add only if node was not already visited
            if(!frontier_trace.includes(children[i].node_to)){
                frontier_trace.push(children[i].node_to);
                
                //console.log(current_node + "   " + children[i].node_to);
                children[i].cost = children[i].cost + G.H[children[i].node_to];
                frontier.enqueue(children[i].node_to, children[i].cost);

                // update paths cost
                var next_children = graph_copy[children[i].node_to];
                for(var j in next_children){
                    next_children[j].cost = children[i].cost + next_children[j].cost;
                }
            }
        }
    }

    var s = "A* Search - Nodes added to frontier: <br/>" + frontier_trace;
	s = s.replaceAll(",", ", ");
	
	return s;
}

G.run = function(){
	var result = document.getElementById("result");
	
	result.innerHTML = G.DepthFirstSearch() + "<br /><br />" + G.BreadthFirstSearch() +
					"<br /><br />" + G.BestFirstSearch() + "<br /><br />" +
					G.GreedySearch() + "<br /><br />" + G.LowestCostFirstSearch() +
					"<br /><br />" + G.AStarSearch();;
}

/*
a , b , 2
a , c , 1
b , d , 2
b , e , 4
c , f , 3
c , g , 5
d , h , 1
f , h , 2
g , k , 8
h , j , 2
h , k , 2
*/