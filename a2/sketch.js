// DMessham loderunner remake

// 
let game = {};
let config = {};

let levels = [
    {
        
    },

]

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
    game.level = 1;

    game.player = {
        x: width / 2,
        y: height - 40,
        w: 30,
        h: 30,
        vx: 0,
        vy: 0,
        hp: 100,
        friction: config.playerSpeed/7,
        jumpTimer: 0,
        jumpTimerReset: 30,
    };

    game.enemies = [
        {   
            x: 10,
            initX: 10,
            y:300,
            initY: 300,
            vx: 0,
            vy: 0,
            w: 20,
            h: 20,
            friction: config.playerSpeed/9,
            state: 'alive' // alive, buried, dead

        },
    ];
    game.platforms = [

    ];
    // game.bullets = [];
    // game.particles = [];
    game.gold = [
        {   
            x: 1,
            y:1,
            collected: false
        },

    ]
    
    game.gold = [];
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

    updateEnemies();
    // updateBullets();

    // handleCollisions();
    // handleGameEvents();

}

function drawGame() {
    drawBackground();
    drawPlayer();

    drawEnemies();
    // drawBullets();
    // drawGold();
}

function drawUI() {
    // Draw a simple HUD in the top-left corner
    fill(255);
    textSize(20);
    text("Score: " + game.score , 20, 30);

    text("Level : " + game.level, 140, 30);

    text("Lives: " + game.lives, 240, 30);

    text("X: " + game.player.x + ", Y: " + game.player.y, 380, 30);
    
    text("vX: " + game.player.vx + ", vY: " + game.player.vy, 20, 55);

    // Helpers from utilities.js
    drawKnobPanel();
    drawFAB();
}

function drawBackground() {
    background(20);
}

function drawPlatforms(){

}

function drawEnemies(){
    fill("red")
    for(i in game.enemies){
        e = game.enemies[i]
        switch(e.state){
            case "buried":
                rect(e.x, e.y+1, e.w, e.h/2);
            case "alive":
                rect(e.x, e.y,e.w, e.h);
            case "dead":
                return
            default:
                rect(e.x+10, e.y+10, 10, 10);
        }

    }
}

function updateEnemies(){
    let playerX = game.player.x + game.player.vx
    let playerY = game.player.y + game.player.vy
    for(i in game.enemies){
        e = game.enemies[i]
        e.x += e.vx;
        e.y += e.vy;
        gravityFall(e)
        
        e.y = constrain(e.y, 0, height - e.h);
        e.x = constrain(e.x, 0, width - e.w);

        if (e.x < playerX+3){
            e.x+=0.75
        }else if (e.x > playerX+3){
            e.x-=0.75
        }
    }
}

function drawGold(){
    fill("gold")

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
    }
    // gravity
    // if(game.player.vy < game.player.friction*37 && (!isPlayerOnLadder() && isOnPlatform) && (game.player.y <= height-game.player.h*2)){
    //     game.player.vy += game.player.friction
    // }

    gravityFall(game.player)
    
    if (game.player.jumpTimer> 0){
        game.player.jumpTimer -= 1
    }


    // Keep player within bounds
    game.player.x = constrain(game.player.x, 0, width - game.player.w);
    if (game.player.y < 2){
        levelWon()
    }
    game.player.y = constrain(game.player.y, 0, height - game.player.h);

}

function playerAttack(x,y,tx,ty){

}

function enemyAttack(x,y,tx,ty){

}

function gravityFall(target){
    if(target.vy < target.friction*37 && (!isOnLadder(target) && !isOnPlatform(target)) && (target.y <= height-target.h*2)){
        target.vy += target.friction
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        game.player.vx = -config.playerSpeed;
    } else if (keyCode === RIGHT_ARROW) {
        game.player.vx = config.playerSpeed;
    } else if (keyCode === UP_ARROW) {
        if(isOnLadder(game.player)){
            game.player.vy = -config.playerSpeed;
        }
        else if(game.player.jumpTimer<1){
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

function levelWon(){
    // todo: move to next level
    game.level++
    game.score += 1000
    game.player.x = width / 2;
    game.player.y = height - 60;
}


function isOnLadder(target){
    // implement ladder detection
    return false;
}

function isOnPlatform(target){
    // implement ladder detection
    return false;
}

function gameOver(){
    // todo: reset game state
}