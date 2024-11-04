// visualizer.js
const svgWidth = 800;
const svgHeight = 600;
let svg;

// Helper function for translating coordinates
function translate(x, y) {
    return `translate(${x}, ${y})`;
}

function createSvg() {
    svg = d3.select("#canvas").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
}

// Create a state node with optional start and accept indicators
function createStateNode(id, x, y, isAccept = false, isStart = false) {
    const fillColor = isAccept ? 'lightgreen' : 'lightblue';
    const stateGroup = svg.append('g')
        .attr('id', `state-${id}`)
        .attr('class', 'state')
        .attr('transform', translate(x, y))
        .call(d3.drag().on('drag', function(event) {
            d3.select(this).attr('transform', translate(event.x, event.y));
            updateTransitions(); 
        }));
    stateGroup.append('circle')
        .attr('r', 20)
        .attr('fill', fillColor)
        .attr('stroke', isStart ? 'orange' : 'black')
        .attr('stroke-width', isAccept ? 4 : 2);

    stateGroup.append('text')
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .text(id);
}

// Draw a transition between two states
function drawTransition(from, to, symbol) {
    const fromGroup = d3.select(`#state-${from}`);
    const toGroup = d3.select(`#state-${to}`);

    if (!fromGroup.empty() && !toGroup.empty()) {
        const fromTransform = fromGroup.attr('transform').match(/translate\(([^)]+)\)/)[1].split(',');
        const toTransform = toGroup.attr('transform').match(/translate\(([^)]+)\)/)[1].split(',');

        const fromX = +fromTransform[0];
        const fromY = +fromTransform[1];
        const toX = +toTransform[0];
        const toY = +toTransform[1];
        const offset = 25;

        if (from === to) {
            // Self-loop path
            const controlPointX = fromX + 40;
            const controlPointY = fromY - 50;
            svg.append('path')
                .attr('d', `M${fromX},${fromY} Q${controlPointX},${controlPointY} ${fromX},${fromY}`)
                .attr('stroke', 'black')
                .attr('fill', 'none')
                .attr('marker-end', 'url(#arrow)')
                .attr('class', 'transition-path');

            svg.append('text')
                .attr('x', controlPointX)
                .attr('y', controlPointY - 5)
                .attr('text-anchor', 'middle')
                .text(symbol)
                .attr('class', 'transition-symbol');
        } else {
            // Transition to another state
            const dx = toX - fromX;
            const dy = toY - fromY;
            const distance = Math.hypot(dx, dy);
            const adjustedFromX = fromX + (offset * dx / distance);
            const adjustedFromY = fromY + (offset * dy / distance);
            const adjustedToX = toX - (offset * dx / distance);
            const adjustedToY = toY - (offset * dy / distance);

            svg.append('line')
                .attr('x1', adjustedFromX)
                .attr('y1', adjustedFromY)
                .attr('x2', adjustedToX)
                .attr('y2', adjustedToY)
                .attr('stroke', 'black')
                .attr('marker-end', 'url(#arrow)')
                .attr('class', 'transition-line');

            const midX = (adjustedFromX + adjustedToX) / 2;
            const midY = (adjustedFromY + adjustedToY) / 2 - 5;
            svg.append('text')
                .attr('x', midX)
                .attr('y', midY)
                .attr('text-anchor', 'middle')
                .text(symbol)
                .attr('class', 'transition-symbol');
        }
    }
}

// Update all transitions after modifying states
function updateTransitions() {
    svg.selectAll('.transition-line').remove();
    svg.selectAll('.transition-path').remove();
    svg.selectAll('.transition-symbol').remove();

    for (const fromState in automaton.states) {
        for (const symbol in automaton.states[fromState]) {
            automaton.states[fromState][symbol].forEach(toState => {
                drawTransition(fromState, toState, symbol);
            });
        }
    }
}

// Update the entire visualization to reflect the automaton's state
function updateVisualization() {
    d3.select("#canvas").select("svg").remove();
    createSvg();

    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 6)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('polygon')
        .attr('points', '0 0, 10 5, 0 10')
        .attr('fill', 'black');

    const statePositions = {
        'q0': { x: 100, y: 300 },
        'q1': { x: 400, y: 200 },
        'q2': { x: 400, y: 400 },
        'q3': { x: 700, y: 300 }
    };

    for (const state in automaton.states) {
        const { x, y } = statePositions[state] || { x: Math.random() * svgWidth, y: Math.random() * svgHeight };
        const isAccept = automaton.acceptStates.has(state);
        const isStart = automaton.startState === state;
        createStateNode(state, x, y, isAccept, isStart);
    }

    for (const fromState in automaton.states) {
        for (const symbol in automaton.states[fromState]) {
            automaton.states[fromState][symbol].forEach(toState => {
                drawTransition(fromState, toState, symbol);
            });
        }
    }
}

// Initialize the SVG canvas
createSvg();
