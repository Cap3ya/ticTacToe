const Flow = {
    turn: 0,
    incTurn(){
        this.turn++ 
    },
    resetTurn() {
        this.turn = 0;
    },
    whoseTurn(x = 0) {
        let player = (this.turn + x) % 2 ? player2 : player1
        return player 
    },
}
const Game = {
    state: ["","","","","","","","",""],
    progress() {
        let count = 0;
        this.state.forEach(element => {
            element !== "" && count++
        });
        return count; 
    },
    winningCombinations: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ],
    setState(element,player) {
        this.state[element.id] = player.character;
        Game.renderState()
    },
    renderState() {
        let i = 0;
        this.state.forEach(element => {
           document.getElementById(i).innerText = element;
           i++
        });
    },
    resetState () {;
        for (let i = 0; i < 9; i++) {
            this.state[i] = ""
        }
        Game.renderState()
    },
};
class Player {
    constructor() {
        this.name = `player${Player.incrementId()}`
        this.combination = new Array();
        this.character = new String();
        this.score = new Number();
    };
    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }
    setCharacter (element) {
        this.character = element.textContent;
    }
    getCombination (element) {
        this.combination.push(Number(element.id));
    }
    resetCombination() {
        this.combination = new Array();
    }
    hasWinningCombination () {
        for (let winningCombination of Game.winningCombinations) {
            if ( winningCombination.every(val => this.combination.includes(val)) ) {
                return true;
            }
        }
    }
    incrementScore() {
        return this.score ? this.score++ : this.score = 1;
    }
    isRobot () {
        return this.character.codePointAt() == 129302 ? true : false;
    }
}

// Define 2 players
let player1 = new Player();
let player2 = new Player();

// HELPER FUNCTIONS
function onClick(selector, f) {
    document.querySelectorAll(selector)
    .forEach(element => element.addEventListener(
        'click', 
        () => f(element)))
}

// AI best move
function bestMove () {
    let winningCombinationsState = []
    for (let combination of Game.winningCombinations) {
        // Map gameState to winningCombination
        let a = combination.map(tdId => Game.state[tdId])
        // Map [1, -1, 0] if gameState is [player1, player2, else]
        let b = a.map(player => player == player2.character ? 1 : player == player1.character ? -1 : 0)
        // Push Abs( Sum (winningCombinationState) ) )
        winningCombinationsState.push( b.reduce( (a, b) => a + b) )
    }
    let index; 
    let winCombState = winningCombinationsState;
    const keys = [2, -2, 1, -1, 0]
    for (let key of keys) {
        for (start = 0; start < 8; start++) {
            if (winCombState.indexOf(key, start) != -1) {
                for (let i of Game.winningCombinations[winCombState.indexOf(key, start)]) {
                    if (Game.state[i] === "") {
                        return i;
                    }
                }
            }
        }
    }
}

//let player; 
let result;