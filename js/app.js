
/* 
app.js
 * Enemy, Player, and Token classes
 * Game objects, levels, dialogs, and events
*/

'use strict';

//// ENEMIES
// Moving objects our player must avoid

// Enemy class
class Enemy {
    constructor({
        enemyRows = [154, 237, 320, 403, 486, 569],
        enemyStartPos = [-100, -300, -500],
        sprite = 'stormtrooper-color',
        x = enemyStartPos[Math.floor(Math.random() * enemyStartPos.length)],
        y = enemyRows[Math.floor(Math.random() * enemyRows.length)],
        speed = 400
    } = {}) {
        this.enemyRows = enemyRows;
        this.enemyStartPos = enemyStartPos;
        this.sprite = `images/${sprite}.png`;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
        this.x = this.x + (this.speed * dt);
        this.y = this.y;
        // Reset enemy position when enemy moves off screen
        if (this.x >= ctx.canvas.width) {
            this.resetPos();
        }
    }

    // Draw the enemy on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Reset enemy position
    resetPos() {
        this.x = this.enemyStartPos[Math.floor(Math.random() * this.enemyStartPos.length)];
        this.y = this.enemyRows[Math.floor(Math.random() * this.enemyRows.length)];
    }
}

// Enemy Subclasses 
// Only difference is default sprite and speed

// Kylo subclass
class Kylo extends Enemy {
    constructor({ enemyRows, enemyStartPos, sprite = 'kyloren-color', x, y, speed = 600 } = {}) {
        super(enemyRows, enemyStartPos, x, y);
        this.sprite = `images/${sprite}.png`;
        this.speed = speed;
    }
}

// Vader subclass
class Vader extends Enemy {
    constructor({ enemyRows, enemyStartPos, sprite = 'vader-color', x, y, speed = 500 } = {}) {
        super(enemyRows, enemyStartPos, x, y);
        this.sprite = `images/${sprite}.png`;
        this.speed = speed;
    }
}

// Enemy specs for level 1
const enemySet_easy = new Set([
    { class: Enemy, numObjs: 5 }
]);

// Enemy specs for level 2
const enemySet_med = new Set([
    { class: Enemy, numObjs: 5 },
    { class: Vader, numObjs: 1 }
]);

// Enemy specs for level 3
const enemySet_hard = new Set([
    { class: Enemy, numObjs: 6 },
    { class: Kylo, numObjs: 1 }
]);


//// PLAYERS
// User chooses a player at start of each game

// Player class
class Player {
    constructor() {
        this.sprite = 'images/bb8-color.png';
        this.soundID = 'bb8';
        this.x = 200;
        this.y = 652;
        this.lives = 3;
        this.livesDisplayed = document.querySelector('.lives span');
        this.points = 0;
        this.pointsDisplayed = document.querySelectorAll('.points span');
    }

    // Update player position and stats
    update() {
        this.x = this.x;
        this.y = this.y;
        this.livesDisplayed.innerHTML = this.lives;
        for (let span of this.pointsDisplayed) {
            span.innerHTML = this.points;
        }
    }

    // Draw player on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Handle arrow key presses during gameplay 
    handleInput(keyPressed) {
        // Reassign player position according to key pressed
        if (keyPressed === 'left' && !(this.x === 0)) {
            this.x = this.x - 100;
        }
        else if (keyPressed === 'right' && !(this.x === 400)) {
            this.x = this.x + 100;
        }
        else if (keyPressed === 'down' && !(this.y > 569)) {
            if (this.y >= 154) {
                this.y = this.y + 83;
            }
        }
        else if (keyPressed === 'up' && !(this.y < 154)) {
            this.y = this.y - 83;
            // player wins game
            if (this.y < 154) {
                game.win();
                this.y = -100;
            }
        }
    }

    // Increase player's points
    addPoints(ptvalue) {
        this.points += ptvalue;
    }

    // Set player back to start position with one less life
    setback() {
        this.resetPos();
        this.loseLife();
    }
    
    // Player loses a life
    loseLife() {
        if (this.lives > 1) {
            this.lives -= 1;
            game.playSound('lastLife');
        } else {
            this.lives = 0;
            game.lose();
        }
    }

    // Reset points
    resetPoints() {
        this.points = 0;
        for (let span of this.pointsDisplayed) {
            span.innerHTML = this.points;
        }
    }

    // Reset player position    
    resetPos() {
        this.x = 200;
        this.y = 652;
    }

    // Reset player lives
    resetLives() {
        this.lives = 3;
        this.livesDisplayed.innerHTML = this.lives;
    }

    // Reset player position, lives, and points
    resetAll() {
        this.resetPos();
        this.resetLives();
        this.resetPoints();
    }
}

// Player Subclasses 
// Different default sprite and sound id

// R2D2 player subclass
class R2D2 extends Player {
    constructor({ sprite = 'r2d2-color', soundID = 'r2d2', x, y, lives, livesDisplayed, points, pointsDisplayed, bestScore, bestScoreDisplayed } = {}) {
        super(x, y, lives, livesDisplayed, points, pointsDisplayed, bestScore, bestScoreDisplayed);
        this.sprite = `images/${sprite}.png`;
        //this.sound = document.getElementById(`${sound}`);
        this.soundID = soundID;
    }
}

// Chewie player subclass
class Chewie extends Player {
    constructor({ sprite = 'chewie-color', soundID = 'chewie', x, y, lives, livesDisplayed, points, pointsDisplayed, bestScore, bestScoreDisplayed } = {}) {
        super(x, y, lives, livesDisplayed, points, pointsDisplayed, bestScore, bestScoreDisplayed);
        this.sprite = `images/${sprite}.png`;
        //this.sound = document.getElementById(`${sound}`);
        this.soundID = soundID;
    }
}

// Set of all player classes
const playerClasses = new Set([Player, R2D2, Chewie]);

// List for player objects of each player class
const playerObjs = [];

for (let player of playerClasses) {
    let char = new player();
    playerObjs.push(char);
}


//// TOKENS
// Stationary objects our player earns points from if collected

// Token class
class Token {
    constructor({
        id = "token", // sound identifier
        sprite = 'rebelSymbol',
        x, y, // x and y provided when new Token object created in game.newLevel()
        points = 1000
    } = {}) {
        this.id = id;
        this.sprite = `images/${sprite}.png`;
        this.x = x;
        this.y = y;
        this.points = points;
    }

    // Update when player collects token
    update() {
        if (this.x === game.player.x && this.y === game.player.y) {
            // move token out of view
            this.x = -100;
            this.render();
            // add points to player
            game.player.addPoints(this.points);
            game.playSound(this.id);
        }
    }

    // Draw the token on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Token Subclasses 
// Different default sprite, sound id, and point value

// JediOrder token subclass
class JediOrder extends Token {
    constructor({ id = "jediOrder", sprite = 'jediOrder-color', x, y, points = 1500 } = {}) {
        super();
        this.id = id;
        this.sprite = `images/${sprite}.png`;
        this.points = points;
        this.x = x;
        this.y = y;
    }
}

// Phoenix token subclass
class Phoenix extends Token {
    constructor({ id = "phoenix", sprite = 'phoenix-color', x, y, points = 2000 } = {}) {
        super();
        this.id = id;
        this.sprite = `images/${sprite}.png`;
        this.points = points;
        this.x = x;
        this.y = y;
    }
}

// Token specs for level 1
const tokenSet_easy = new Set([
    { class: Token, numObjs: 3 },
    { class: Phoenix, numObjs: 2 }
]);

// Token specs for level 2
const tokenSet_med = new Set([
    { class: Token, numObjs: 3 },
    { class: Phoenix, numObjs: 2 },
    { class: JediOrder, numObjs: 1 }
]);

// Token specs for level 3
const tokenSet_hard = new Set([
    { class: Token, numObjs: 3 },
    { class: Phoenix, numObjs: 2 },
    { class: JediOrder, numObjs: 1 }
]);


//// LEVELS
// Enemy and token objects according to level 

const one = {
    enemies: enemySet_easy,
    tokens: tokenSet_easy
}

const two = {
    enemies: enemySet_med,
    tokens: tokenSet_med
}

const three = {
    enemies: enemySet_hard,
    tokens: tokenSet_hard
}


//// DIALOG
// Appears at start of new game, level, and end of game
// Displays player(s), player/game stats, message and start button

let dialog = {
    
    // Dialog HTML elements
    container: document.querySelector('dialog'),
    playersToSelect: document.getElementById('playersToSelect'),
    selected: document.getElementById('selected'),
    start: document.getElementById('start'),
    msg: document.getElementById('msg'),

    // Dialog variables
    playersList: [],
    selectedPlayer: 0,
    endGame: false,
    
    // Initial function called one time to create image elements from available player objects
    // image elements are used for the dialog only
    init() {
        let i = 0;
        for (let char of playerObjs) {
            let $img = document.createElement('img');
            $img.setAttribute('src', char.sprite);
            $img.setAttribute('id', i);
            this.playersToSelect.appendChild($img);
            this.playersList.push($img);
            i += 1;
        }
        this.selectedPlayer = this.playersToSelect.firstChild;
        this.selectedPlayer.classList.add('selected');
        this.newGame();
    },

    // Dialog at start of a new game
    newGame() {
        this.msg.innerHTML = "Choose a Player";
        this.start.innerHTML = "Start Game";
        this.playersToSelect.hidden = false;
        this.selected.hidden = true;
        this.endGame = false;
        game.reset();
        if (!this.container.hasAttribute('open')) {
            // polyfill for registering dialog
            dialogPolyfill.registerDialog(this.container);
            this.container.showModal();
        }
    },

    // Dialog at end/start of each level
    winLevel() {
        this.msg.innerHTML = `You made it!<br><span>Prepare yourself...the next mission will be harder than the last</span>`;
        this.start.innerHTML = `Start Level ${game.level}`;
        this.playersToSelect.hidden = true;
        this.selected.setAttribute('src', game.player.sprite);
        this.selected.hidden = false;
        this.endGame = false;
        // polyfill for registering dialog
        dialogPolyfill.registerDialog(this.container); 
        this.container.showModal();
        game.playSound('winLevel');
    },

    // Dialog when player wins game
    winGame() {
        if (game.bestScore == game.maxScore) {
            this.msg.innerHTML = `Mission complete!<br><span>Perfect score!</span>`;
        } else {
            this.msg.innerHTML = `Mission complete!<br><span>Plan again and beat your best score</span>`;
        }
        this.start.innerHTML = "Play Again";
        this.endGame = true;
        // polyfill for registering dialog
        dialogPolyfill.registerDialog(this.container); 
        this.container.showModal();
        game.playSound('winGame');
    },

    // Dialog when player loses game
    lose() {
        this.msg.innerHTML = `Game over!<br><span>You failed to complete your mission</span>`;
        this.start.innerHTML = "Try Again";
        this.playersToSelect.hidden = true;
        this.selected.setAttribute('src', game.player.sprite);
        this.selected.hidden = false;
        this.endGame = true;
        // polyfill for registering dialog
        dialogPolyfill.registerDialog(this.container);
        this.container.showModal();
        game.playSound('lose');
    },

    // Handle arrow key presses when a dialog is open
    handleInput(keyPressed) {

        // variable to keep track of player image selection
        let playerID = Number(this.selectedPlayer.getAttribute('id'));

        // move backward through player images
        if ((keyPressed === 'left' || keyPressed === 'up') && playerID > 0) {

            this.selectedPlayer.classList.remove('selected');
            playerID = playerID - 1;
            this.updateSelected(playerID);
        }

        // move forward through player images
        else if ((keyPressed === 'right' || keyPressed === 'down') && playerID < (playerObjs.length - 1)) {

            this.selectedPlayer.classList.remove('selected');
            playerID = playerID + 1;
            this.updateSelected(playerID);
        }
    },

    // update selected player
    updateSelected(playerID) {
        this.selectedPlayer = document.getElementById(`${playerID}`);
        this.selectedPlayer.classList.add('selected');
        game.playSound(playerObjs[playerID].soundID);
    }
}

//// GAME
// create new levels for each game from map of objects

let game = {
    
    // Game HTML elements
    bestScoreDisplayed: document.querySelector('.bestScore span'),
    levelDisplayed: document.querySelector('.level span'),
    sounds: document.getElementById('audio').children, // HTML collection

    // Game variables
    player: 0,
    bestScore: 0,
    maxScore: 0,
    level: 1,
    levelObjs: new Map(),
    allTokens: [],
    allEnemies: [],

    // Create new level
    newLevel() {

        // begin rebel theme music
        game.playSound('rebelTheme');
        
        // reset player position and level displayed
        this.player.resetPos();
        this.levelDisplayed.innerHTML = this.level;

        // store objects according to game level
        let objects = this.levelObjs.get(this.level);

        // generate enemies according to enemy set
        this.allEnemies = [];
        for (let item of objects.enemies) {
            for (let num = 0; num < item.numObjs; num++) {
                const newEnemy = new (item.class);
                this.allEnemies.push(newEnemy);
            }
        }

        // create rows and cols to provide x-y positions for tokens
        const rows = [154, 237, 320, 403, 486, 569];
        const cols = [100, 200, 300, 400];

        // create list of all x-y positions
        let xyFree = [];
        for (let col of cols) {
            for (let row of rows) {
                let xy = [col, row];
                xyFree.push(xy);
            }
        }

        // generate tokens according to token set
        this.allTokens = [];
        for (let item of objects.tokens) {
            for (let num = 0; num < item.numObjs; num++) {
                // assign random x-y position from remaining x-y positions
                let index = Math.floor(Math.random() * (xyFree.length));
                // create new token object at assigned random x-y position
                const newToken = new item.class({
                    x: xyFree[index][0],
                    y: xyFree[index][1]
                });
                // remove the used x-y position from list to prevent overlapping token objects drawn to canvas
                xyFree.splice(index, 1);
                // add new token object to list of token objects
                this.allTokens.push(newToken);
                // add token's point value to max score a user can earn by end of game
                this.maxScore += newToken.points;
            }
        }
    },

    // Player wins level
    win() {
        if (this.level != game.levelObjs.size) {
            this.level += 1;
            dialog.winLevel();
        } else {
            game.stopSound('rebelTheme');
            this.updateBest();
            this.level = 1;
            dialog.winGame();
        }
    },

    // Player loses game
    lose() {
        game.stopSound('rebelTheme');
        this.allEnemies = [];
        this.level = 1;
        game.player.y = -100;
        dialog.lose();
    },

    // Objects and variables reset before new game
    reset() {
        if (this.player !== 0) {
            this.player.resetAll();
            this.player = 0;
        }
        this.allEnemies = [];
        this.allTokens = [];
        this.maxScore = 0;
        this.levelDisplayed.innerHTML = game.level;
    },

    // Play sound from HTML collection by ID
    playSound(id) {
        this.sounds.namedItem(id).play();
    },

    // Pause sound from HTML collection by ID
    pauseSound(id) {
        this.sounds.namedItem(id).pause();
    },

    // Stop sound from HTML collection by ID
    stopSound(id) {
        this.sounds.namedItem(id).pause();
        this.sounds.namedItem(id).currentTime = 0;
    },

    // Update user's best score
    updateBest() {
        if (this.bestScore < this.player.points) {
            this.bestScore = this.player.points;
        }
        this.bestScoreDisplayed.innerHTML = this.bestScore;
    },

    // Set game player to user's selected player
    setPlayerToSelected(id) {
        this.player = playerObjs[id];
    }
}


// Add each game level object to a map of game objects according to level
game.levelObjs.set(1, one);
game.levelObjs.set(2, two);
game.levelObjs.set(3, three);


//// EVENT LISTENERS

// Listen for arrow key presses
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }
    // allow user to select player using arrow keys
    if (dialog.container.open && (!dialog.playersToSelect.hidden)) {
        dialog.handleInput(allowedKeys[e.keyCode]);
    } else {
        game.player.handleInput(allowedKeys[e.keyCode]);
    }
});

// Listen for click on dialog element containing player images
dialog.playersToSelect.addEventListener('click', function () {
    if (event.target.nodeName === 'IMG') {
        let playerID = event.target.getAttribute('id');
        dialog.selectedPlayer.classList.remove('selected');
        dialog.updateSelected(playerID);
    }
});

// Listen for click on dialog start button
dialog.start.addEventListener('click', function () {
    // start new game after game has ended
    if (dialog.endGame) {
        dialog.newGame();
    } 
    // start next level with current player selection
    else { 
        game.setPlayerToSelected(dialog.selectedPlayer.getAttribute('id'));
        game.newLevel();
        dialog.container.close();
    }
});