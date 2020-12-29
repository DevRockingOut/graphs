var AC_3 = AC_3 || {};

AC_3.init = function(){
    var inputs = "<textarea id='graph' onchange='AC_3.parseGraph(this.value)'>from, to, constraint\nA , B , (A < B)</textarea>" +
                "<textarea id='domains' name='domains' placeholder='Enter domains here in format:a = 1, 2, 3 or a = (1, 2, 3) or a = [1-3]' onchange='AC_3.parseDomains(this.value)'></textarea>'";

    var btn = "<br/><input type='button' class='btn-run' onclick='AC_3.run()' value='Run' />";

    var output = "<br /><div id='result'></div>";

    document.getElementById("playground").innerHTML = inputs;
    document.getElementById("playground").innerHTML += btn + output;
}


/**
 * Creates a AC 3 graph from inputs
 * @param {any} edges Edges in graph
 */
AC_3.parseGraph = function(edges){
    var arr = [];
    AC_3.graph = [];

    arr = edges.split("\n");

    for(var i in arr){
        var edge = arr[i].split(",");
        var from = edge[0].trim();
        var to = edge[1].trim();
        var c =  edge[2].replace("(", "").replace(")", "").trim();
        var parts = c.split(" ");

        // add edge to graph
        AC_3.graph.push({
            node_from: from,
            node_to: to,
            constraint: parts
        });

        var inverse_parts = parts.map((x) => x);

        if(inverse_parts[1] == ">"){
            inverse_parts[1] = "<";
        }else if(inverse_parts[1] == "<"){
            inverse_parts[1] = ">";
        }

        // create inverse constraint
        var tmp = inverse_parts[0];
        inverse_parts[0] = inverse_parts[2];
        inverse_parts[2] = tmp;

        // add inverse of edge
        AC_3.graph.push({
            node_from: to,
            node_to: from,
            constraint: inverse_parts
        });
    }
}

/**
 * Store the domain of nodes in graph
 * @param {any} domains 
 */
AC_3.parseDomains = function(domains){
    var arr = domains.split("\n");
    AC_3.nodes = [];
    AC_3.domains = [];
    
    for(var i in arr){
        var parts = arr[i].split("=");
        var name = parts[0].trim();
        var domain = [];

        if(!AC_3.nodes.includes(name)){
            AC_3.nodes.push(name);
        }
        
        if(parts[1].indexOf("[") > -1){
            var range = parts[1].replace("[", "").replace("]", "").split("-");
            
            var from = parseInt(range[0].trim()); 
            var to = parseInt(range[1].trim()); 

            // add all possible values in range to domain
            for(var k = from; k <= to; k++){
                domain.push(k);
            }
        }else{
            domain = parts[1].replace("(", "").replace(")", "").split(",");
            for(var j in domain){
                domain[j] = parseInt(domain[j].trim());
            }
        }

        AC_3.domains[name] = domain;
    }
}

/**
 * Returns true if the domain of a node in graph is updated
 * @param {any} constraint Constraint on an edge
 */
AC_3.revise = function(constraint){
    var D1 = AC_3.domains[constraint[0]];
    var D2 = AC_3.domains[constraint[2]];
    var op = constraint[1];
    var revised = false;
    var satisfy = {
        '<': function(x, y) { return x < y },
        '>': function(x, y) { return x > y },
        '=': function(x, Y) { return Y.includes(x) },
        '!=': function(x, Y) { return !(Y.includes(x)) }
    };
    
    for(var i = 0; i < D1.length; i++){
        var satisfied = false;

        if(op == '=' || op == '!='){
            if( satisfy[op](D1[i], D2) ){
                satisfied = true;
            }
        }else{
            for(var j in D2){
                // check if constraint is satisfied
                if( satisfy[op](D1[i], D2[j]) ){
                    satisfied = true;
                }
            }
        }
        
        if(!satisfied){
            // remove element at index i from array
            D1.splice(i, 1);
            revised = true;
            i = i - 1;
        }
    }

    return revised;
}

AC_3.run = function(){
    // copy edges of graph and store in Queue
    var Q = AC_3.graph.map((x) => x);

    while(Q.length > 0){
        // grab first element from Queue
        var edge = Q.shift();

        if(AC_3.revise(edge.constraint)){
            
            for(var i in AC_3.graph){
                if(AC_3.graph[i].node_to == edge.node_from && AC_3.graph[i] != edge){
                    Q.push(AC_3.graph[i]);
                }
            }
        }
    }

    var result = document.getElementById("result");

    var s = "<p>Solution: " + AC_3.print() + " </p>";

    result.innerHTML += s;
}

AC_3.print = function(){
    var s = "<br />";

    for(var i in AC_3.nodes){
        s += AC_3.nodes[i] + ":  (" + AC_3.domains[AC_3.nodes[i]] + ")";
        s = s.replaceAll(",", ", ");
        s += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    console.log(AC_3.nodes);

    return s;
}