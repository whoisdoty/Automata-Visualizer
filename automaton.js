class Automaton {
    constructor(type = 'DFA') {
        this.type = type;
        this.states = {};
        this.startState = null;
        this.acceptStates = new Set();
    }

    addState(name, isAccept = false) {
        this.states[name] = {};
        if (isAccept) this.acceptStates.add(name);
    }

    setTransition(from, to, symbol) {
        if (!this.states[from]) return;
        if (!this.states[from][symbol]) this.states[from][symbol] = new Set();
        this.states[from][symbol].add(to);
    }

    setStartState(name) {
        this.startState = name;
    }

    setAcceptState(name) {
        if (this.states[name]) {
            this.acceptStates.add(name);
        }
    }

    testString(input) {
        let currentStates = new Set([this.startState]);
        for (let symbol of input) {
            const newStates = new Set();
            currentStates.forEach(state => {
                const transitions = this.states[state][symbol];
                if (transitions) transitions.forEach(newState => newStates.add(newState));
            });
            currentStates = newStates;
        }
        return Array.from(currentStates).some(state => this.acceptStates.has(state));
    }
    removeState(name) {
        if (!this.states[name]) return;  // Check if the state exists
    
        // Remove the state and its transitions
        delete this.states[name];
        this.acceptStates.delete(name);
        
        // Reset start state if it is the one being removed
        if (this.startState === name) {
            this.startState = null;
        }
    
        // Remove all transitions to the deleted state
        for (const fromState in this.states) {
            for (const symbol in this.states[fromState]) {
                this.states[fromState][symbol].delete(name);  // Remove the state from transitions
                if (this.states[fromState][symbol].size === 0) {
                    delete this.states[fromState][symbol];  // Clean up empty transition sets
                }
            }
        }
    }
    
}

// Global instance of Automaton
const automaton = new Automaton(); 