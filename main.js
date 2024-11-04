function addState() {
    const stateName = prompt("Enter state name:");
    if (stateName) {
        automaton.addState(stateName);
        updateVisualization();
    }
}

function setStartState() {
    const stateName = prompt("Enter start state:");
    if (stateName && automaton.states[stateName]) {
        automaton.startState = stateName;
        updateVisualization(); 
    } else {
        alert("State does not exist.");
    }
}

function setAcceptState() {
    const stateName = prompt("Enter accept state:");
    if (stateName && automaton.states[stateName]) {
        automaton.acceptStates.add(stateName);
        updateVisualization(); 
    } else {
        alert("State does not exist.");
    }
}

function addTransition() {
    const fromState = document.getElementById("fromState").value;
    const toState = document.getElementById("toState").value;
    const symbol = document.getElementById("transitionSymbol").value;
    if (fromState && toState && symbol) {
        automaton.setTransition(fromState, toState, symbol);
        updateVisualization();
    } else {
        alert("Please ensure both states and symbol are filled.");
    }
}

function testString() {
    const input = document.getElementById("inputString").value;
    const result = automaton.testString(input);
    alert(result ? "Accepted" : "Rejected");
}

function removeStateByName() {
    const stateName = prompt("Enter the name of the state to remove:");
    if (stateName && automaton.states[stateName]) {
        automaton.removeState(stateName);
        updateVisualization(); 
    } else {
        alert("State not found.");
    }
}
function saveDiagramAsImage() {
    const svgElement = document.querySelector('#canvas svg'); // Selects the D3 SVG element
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
  
    img.onload = function() {
      canvas.width = svgElement.clientWidth;
      canvas.height = svgElement.clientHeight;
      context.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
  
      // Convert canvas to data URL and download
      const link = document.createElement('a');
      link.download = 'automaton_diagram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  
    img.src = url;
  }
  
