let game = {};
let config = {};

let IS_DEBUG = true;

function setup() {
    createCanvas(800, 500);

    initUI();
    initGameState();
}

function draw() {
    updateGame();
    drawGame();
    drawUI();
}

function initUI() {
    // Show debug UI FAB in debug mode
    if (IS_DEBUG) {
        createFAB(width - 40, height - 40, 24, "≡", () => {
            UTIL_UI.panelOpen = !UTIL_UI.panelOpen;
        });
    }

    createKnob("speed", 60, 120, 16, 1, 10, 4);
    
    createKnob("jumpDelay", 60, 200, 16, 1, 60, 25);
    
    createKnob("jumpTimer", 140, 160, 16, 1, 60, 60);
}

function initGameState() {
    game = {
        scene: "play",
        score: 0,
        lives: 0,
        timer: 0
    };

    game.player = {};
    // game.enemies = [];
    // game.obstacles = [];
    // game.food = [];

    config = {
        playerSpeed: 2,
        // enemySpeed: 2,
        // spawnRate: 60,
        debug: IS_DEBUG
    };

    resetGameState();
}

function resetGameState() {
    game.score = 0;
    game.lives = 3;
    game.timer = 0;
    game.scene = "play";

    game.player = {
        x: width / 2,
        y: height - 60,
        w: 30,
        h: 30,
        vx: 0,
        vy: 0,
        hp: 100,
        friction: config.playerSpeed/7,
        jumpTimer: 0,
        jumpTimerReset: 30,
    };

    // game.enemies = [];
    // game.obstacles = [];
    // game.bullets = [];
    // game.particles = [];
}

function updateGame() {
    if (IS_DEBUG) {
        config.playerSpeed = Math.round(getKnobValue('speed'));
        game.player.jumpTimerReset = Math.round(getKnobValue('jumpDelay'));
        
        setKnobValue('jumpTimer', game.player.jumpTimer)
    }

    if (game.scene !== "play") return;

    updatePlayer();


    game.timer++;

    // updateEnemies();
    // updateBullets();

    // handleCollisions();
    // handleGameEvents();

}

function drawGame() {
    drawBackground();
    drawPlayer();

    // drawEnemies();
    // drawBullets();
    // drawFood();
}

function drawUI() {
    // Draw a simple HUD in the top-left corner
    fill(255);
    textSize(20);
    text("Score: " + game.score , 20, 30);
    text("Lives: " + game.lives, 20, 55);
    text("X: " + game.player.x + ", Y: " + game.player.y, 120, 30);
    
    text("vX: " + game.player.vx + ", vY: " + game.player.vy, 120, 55);

    // Helpers from utilities.js
    drawKnobPanel();
    drawFAB();
}

function drawBackground() {
    background(20);
}

function drawPlayer() {
    fill(255);
    rect(game.player.x, game.player.y, game.player.w, game.player.h);
}

function updatePlayer() {
    game.player.x += game.player.vx;
    game.player.y += game.player.vy;

    // decelerate player

    if (game.player.vx>game.player.friction){
        game.player.vx -= game.player.friction
    }
    else if (game.player.vx<-game.player.friction){
        game.player.vx += game.player.friction
    }
    else{
        game.player.vx = 0
        // snap the player to the nearest grid coord
        // game.player.x = (map(game.player.x, 0, width-game.player.w, 0, (width-game.player.w)/game.player.w))*game.player.w
    }
    // if (game.player.vy>game.player.friction){
    //     game.player.vy -= game.player.friction
    // }
    // else if (game.player.vy<-game.player.friction){
    //     game.player.vy += game.player.friction
    // }
    // else {
    //     game.player.vy = 0
    // }

    // gravity
    if(game.player.vy < game.player.friction*37){
        game.player.vy += game.player.friction
    }
    
    if (game.player.jumpTimer> 0){
        game.player.jumpTimer -= 1
    }


    // Keep player within bounds
    game.player.x = constrain(game.player.x, 0, width - game.player.w);
    game.player.y = constrain(game.player.y, 0, height - game.player.h);

}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        game.player.vx = -config.playerSpeed;
    } else if (keyCode === RIGHT_ARROW) {
        game.player.vx = config.playerSpeed;
    } else if (keyCode === UP_ARROW) {
        if(game.player.jumpTimer<1){
            game.player.vy = -config.playerSpeed;
            game.player.jumpTimer = game.player.jumpTimerReset
        }
        // game.player.vy = -config.playerSpeed;
    } else if (keyCode === DOWN_ARROW) {
        game.player.vy = config.playerSpeed;
    }
}


function mousePressed() {
    if (handleFABPressed()) return;
    if (handleKnobPressed()) return;
}

function mouseDragged() {
    handleKnobDragged();
}

function mouseReleased() {
    handleKnobReleased();
}