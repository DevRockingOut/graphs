var PQ = PQ || {};

PQ.values = [];

function PriorityQueue(){
    return PQ;
}

/**
 * Add element to Priority Queue
 * @param {any} e Element
 * @param {Number} p Priority value
 */
PQ.enqueue = function (e, p) {
    var newNode = {
        val: e,
        priority: p
    };

    PQ.values.push(newNode);
    var index = 1;
    var current;
    
    while (PQ.values.length > 1 && index < PQ.values.length) {
        var parentIndex = index - 1;
        var parent = PQ.values[parentIndex];
        current = PQ.values[index];
        
        if (parent.priority > current.priority) {
            PQ.values[parentIndex] = current;
            PQ.values[index] = parent;
        } else {
            index++;
        }
    }
}

/**
 * Remove element from Priority Queue, and returns Element with highest priority
 * @return {any} Element with max priority
 */
PQ.dequeue = function () {
    return PQ.values.shift().val;
}