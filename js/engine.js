/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 750;

    const $canvas = doc.getElementById('canvas');
    $canvas.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
        dialog.init();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        
        updateEntities(dt);

        // if browser window size is too small to fit canvas, a red border surrounding the canvas alerts the user to resize the window
        if (window.innerHeight < (canvas.height + 50) || window.innerWidth < (canvas.width + 10)) {
            doc.body.classList.add('outline');
        } else {
            doc.body.classList.remove('outline');
        }

    }

    /* This is called by the update function and loops through all of the
     * objects within your game.allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        if (game.player !== 0) {
            game.player.update();
        }
        game.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        game.allTokens.forEach(function(token) {
            token.update();
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        // Clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Draw background for game
        ctx.beginPath();
        ctx.arc(252.5, -150, 252.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(51, 51, 51, 1)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(252.5, -150, 275, 0.30 * Math.PI, 0.70 * Math.PI, false);
        ctx.lineTo(252, -150);
        ctx.closePath();
        ctx.lineWidth = 8;
        ctx.fillStyle = 'rgba(51, 51, 51, 1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(32, 34, 46, 1)';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(252.5, 80, 10, 0, 2 * Math.PI, false);
        ctx.moveTo(312.5,60);
        ctx.arc(312.5, 70, 10, 0, 2 * Math.PI, false);
        ctx.moveTo(192.5,60);
        ctx.arc(192.5, 70, 10, 0, 2 * Math.PI, false);
        ctx.moveTo(252.5, 50)
        ctx.arc(252.5, 30, 10, 0, 2 * Math.PI, false);
        ctx.moveTo(292.5,60);
        ctx.arc(292.5, 25, 10, 0, 2 * Math.PI, false);
        ctx.moveTo(212.5,60);
        ctx.arc(212.5, 25, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(32, 34, 46, 1)';
        ctx.fill();
        
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the game.allEnemies array and call
         * the render function you have defined.
         */
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        game.allTokens.forEach(function(token) {
            token.render();
        });

        if (game.player !== 0) {
            game.player.render();
        }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/bb8-color.png',
        'images/stormtrooper-color.png',
        'images/kyloren-color.png',
        'images/rebelSymbol.png',
        'images/r2d2-color.png',
        'images/vader-color.png',
        'images/phoenix-color.png',
        'images/chewie-color.png',
        'images/jediOrder-color.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
