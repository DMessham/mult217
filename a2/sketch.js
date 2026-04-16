// DMessham loderunner remake

// 
let game = {};
let config = {};

let physDelta = 1


let levels = [
    {
        
    },

]

let eCarIMG 
let eSmileIMG
let eSwordIMG
let music

let IS_DEBUG = true;

function setup() {
    createCanvas(800, 500);

    initUI();
    initGameState();
}

function preload(){
    playerIMG = loadImage("player.svg");
    
    eCarIMG = loadImage("enemy.svg");
    eSmileIMG = loadImage("watching.svg");
    eSwordIMG = loadImage("sword.svg");
    music=[
        "11_-_Doom_-_3DO_-_Donna_To_The_Rescue.ogg",//normal
        "03_-_Doom_-_3DO_-_Dark_Halls.ogg",
        "08_-_Doom_-_3DO_-_Sign_Of_Evil.ogg",//little time
        "09_-_Doom_-_3DO_-_Hiding_The_Secrets.ogg",
        "12_-_Doom_-_3DO_-_Untitled.ogg"
    ]

}

function draw() {
    // framerate adaptive physics, less than 1 means too fast > 1 means too slow
    // physDelta = constrain((deltaTime-1.66667)/15, 0, 2)
    physDelta = deltaTime*(frameRate()/1000)
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
        timer: 0,
        timeLimit: 240,
        level: 1,
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

    
    playerIMG = loadImage("player.svg");
    
    eCarIMG = loadImage("enemy.svg");
    eSmileIMG = loadImage("watching.svg");
    eSwordIMG = loadImage("sword.svg");

    game.score = 0;
    game.lives = 3;
    game.timer = 0;
    game.scene = "play";
    game.timeLimit = 240,

    game.timeLeft = game.timeLimit - game.timer

    game.frameTrack = 0

    game.player = {
        x: width / 2,
        y: height - 40,
        w: 30,
        h: 30,
        vx: 0,
        vy: 0,
        hp: 100,
        friction: config.playerSpeed/6,
        jumpTimer: 0,
        jumpTimerReset: 30,
    };

    game.enemies = [
        {   
            x: 10,
            startX: 10,
            y:300,
            vx: 0,
            vy: 0,
            w: 40,
            h: 20,
            friction: config.playerSpeed/9,
            speed: 0.05,
            state: 'disabled', // alive, disabled, dead
            type:"cart",//cart:charges in the dir of player and dies when hitting walls, sword: chases the player slowly, orb: noclip, slow movement
            sight: 'horizontal', // horizontal, radius, always, 
            sightVal: 10, // horizontal: up+down from top & bottom, radius: duh, always:not used
            wakeRange: 90,
            lastKnownPlayerPos:[null, null],
            canSeePlayer: false,

        },
        {   
            x: 110,
            y:300,
            vx: 0,
            vy: 0,
            w: 20,
            h: 20,
            friction: config.playerSpeed/9,
            speed: 0.025,
            state: 'alive', // alive, disabled/blinded, dead
            type:"sword",
            sight: 'radius', // horizontal, radius, always, 
            sightVal: 60, // horizontal: up+down from top & bottom, radius: duh, always:not used
            wakeRange: 90,
            lastKnownPlayerPos:[null, null],
            canSeePlayer: false,

        },
        {   
            x: 110,
            y:300,
            vx: 0,
            vy: 0,
            w: 20,
            h: 20,
            friction: config.playerSpeed/9,
            speed: 1,
            state: 'alive', // alive, disabled/blinded, dead
            type:"smileball",
            sight: 'always', // horizontal, radius, always, 
            sightVal: 600, // horizontal: up+down from top & bottom, radius: duh, always:not used
            wakeRange: 90,
            lastKnownPlayerPos:[null, null],
            canSeePlayer: false,

        },
    ];
    game.platforms = [
        {
            x:0,
            y:497,
            w:width,
            h:5,
            color:"gray"
        },{
            x:50,
            y:450,
            w:600,
            h:5,
            color:"gray"
        },{
            x:250,
            y:390,
            w:500,
            h:5,
            color:"gray"
        },
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
}

function updateGame() {
    
    game.frameTrack++;

    if (IS_DEBUG) {
        config.playerSpeed = Math.round(getKnobValue('speed'));
        game.player.jumpTimerReset = Math.round(getKnobValue('jumpDelay'));
        
        setKnobValue('jumpTimer', game.player.jumpTimer)
    }

    if (game.scene !== "play") return;
    game.timer+=physDelta/60

    game.timeLeft = game.timeLimit - game.timer

    updatePlayer();



    updateEnemies();
    // updateBullets();

    // handleCollisions();
    // handleGameEvents();

}

function drawGame() {
    drawBackground();
    drawPlatforms();
    
    drawGold();
    drawPlayer();

    drawEnemies();
    // drawBullets();
}

function drawUI() {
    // Draw a simple HUD in the top-left corner
    fill(255);
    textSize(20);
    text("Score: " + game.score , 20, 30);

    text("Level : " + game.level, 140, 30);

    text("Lives: " + game.lives, 240, 30);

    if(game.timeLimit - game.timer  > 240){
        text("Time: " + round(game.timer,1), 330, 30);
    } else {
        
        text("Time Left: " + round(game.timeLimit - game.timer,1), 330, 30);
    }


    text("X: " + round(game.player.x,2), 580, 30);
    text("Y: " + round(game.player.y,2), 680, 30);
    
    text("vX: " + round(game.player.vx,2) + ", vY: " + round(game.player.vy,2), 20, 55);

    text("fps: "+ getTargetFrameRate() + " phys:" + round(physDelta,3)+" delta: " + round(deltaTime,4), 20, 75)

    // Helpers from utilities.js
    drawKnobPanel();
    drawFAB();
}

function drawBackground() {
    background(20);
}

function drawPlatforms(){
    
    for(i in game.platforms){
        e =  game.platforms[i]
        fill(e.color)
        rect(e.x, e.y, e.w, e.h);
    }
}

function drawEnemies(){
    for(i in game.enemies){
        let e = game.enemies[i]
        switch(e.state){
            case "buried":
                fill(192,0,0)
                // rect(e.x, e.y+1, e.w, e.h/2);
            case "disabled":
                fill(128,0,0)
                // rect(e.x, e.y+1, e.w, e.h/2);
            case "alive":
                fill(255,0,0)
                // rect(e.x, e.y,e.w, e.h);
            case "dead":
                // return()
                fill(64,0,0)
                // rect(e.x, e.y,e.w/3, e.h/3);
            default:
                fill("pink")
                // rect(e.x+10, e.y+10, 10, 10);
        }
        
        rect(e.x, e.y, e.w, e.h);

        if(e.type == "car"||e.type=="cart"){
            image(loadImage("enemy.svg"), e.x, e.y, e.w, e.h)
        } else if(e.type=="smileball"){
            image(eSmileIMG, e.x, e.y, e.w, e.h)
        }else {
            image(eSwordIMG, e.x, e.y, e.w, e.h)

        }
        if(IS_DEBUG == true){
            fill(192)
            text(e.type + ": " + e.state , e.x, e.y);

        }

    }
}

function updateEnemies(){
    let playerX = game.player.x + game.player.vx*physDelta
    let playerY = game.player.y + game.player.vy*physDelta
    for(i in game.enemies){
        let e = game.enemies[i]
        e.x += e.vx;
        e.y += e.vy;
        
        e.y = constrain(e.y, 0, height - e.h);
        e.x = constrain(e.x, 0, width - e.w);

        //check if the enemy can see the player
        
        if(e.state == 'dead'){
            gravityFall(e)
            return
        }
        else if(e.state == 'alive'){
             // if(abs(checkPlayerProx(e.x,e.y,'radius')*1.4)>=e.sightVal){
                enemyChase(e, playerX, playerY)
                gravityFall(e)
            // }
        }
        else if(e.state == 'disabled'){
            // todo: add wakeup logic
            gravityFall(e)
            //check if the player is in wakeup range (half normal sight range)
            if(abs(checkPlayerProx(e.x,e.y,'radius')*0.75)>=e.sightVal){
                // return
            } else{
                e.state = 'alive'
                enemyChase(e, playerX-15, playerY)
            }
        }
    }
}

function enemyChase(e, playerX, playerY){
    
    // e.canSeePlayer = false
    // e.canSeePlayer = true

    if(e.sight == "radius"){
        //check if the player is at a similar horizontal level
        if(
            (playerY>=e.y-e.sightVal) && (playerY<=e.y+e.h+e.sightVal)
        ){
            e.canSeePlayer = true
        } 
        // else {e.canSeePlayer = false}

    }
    else if(e.sight == "horizontal"){
            //check if the player is at a similar horizontal level
            if(
                (playerY>=e.y-e.sightVal) && (playerY<=e.y+e.h+e.sightVal)
            ){
                e.canSeePlayer = true
            } 
            // else {e.canSeePlayer = false}

    }
    else if(e.sight == "always"){
        //basically noclip, for when time runs out
        e.canSeePlayer = true

    }

    if(e.canSeePlayer){
        // console.log(`enemy located at ${e.x},${e.y} using ${e.sight} sight can see player`)
        if(e.sight == 'horizontal'){
            if (e.x < playerX-30){
                e.vx+=e.speed
            }else if (e.x > playerX){
                e.vx-=e.speed
            }
        }
        else if (e.sight == "radius"){
            if (e.x < playerX+e.w){
                e.vx+=e.speed
            }else if (e.x > playerX+e.w){
                e.vx-=e.speed
            }
        } else if (e.sight == "always"){
            e.vx += (checkPlayerProx(e.x,e.y,'x'))*0.000075*e.speed
            
            e.vy += (checkPlayerProx(e.x,e.y,'y'))*0.0011*e.speed
        }
    }

    
}

function checkPlayerProx(originX,originY,mode){
    let hDist = game.player.x-originX
    let vDist = game.player.y-originY
    switch(mode){
        case 'horizontal':
        case 'x':
            return(game.player.x-originX)
        case 'vertical':
        case 'y':
            return(game.player.y-originY)
        default:
            //return whichever dist is smaller
            if(abs(hDist)>abs(vDist)){
                return(game.player.x-originX)
            }else{
                return(game.player.y-originY)
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

    if (game.timeLeft <=0){
        gameOver("timeLimit")
    }

    game.player.x += game.player.vx*physDelta;
    game.player.y += game.player.vy*physDelta;

    if (keyIsDown(LEFT_ARROW)){game.player.vx = -config.playerSpeed;}
    else if (keyIsDown(RIGHT_ARROW)){game.player.vx = config.playerSpeed;}

    // decelerate player
    if (game.player.vx>game.player.friction){
        game.player.vx -= game.player.friction*physDelta
    }
    else if (game.player.vx<-game.player.friction){
        game.player.vx += game.player.friction*physDelta
    }
    else{
        game.player.vx = 0
    }
    // gravity
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

    //detect contact with an enemy


    // make a player falling fast enough on an enemy kill it

    //todo: make a player that hits the ground fast enough w/o hitting an enemy or a ladder (or water?) die
}

function playerAttack(x,y,tx,ty){

}

function enemyAttack(x,y,tx,ty){
    let playerHit=false

    if(playerHit){
        
        gameOver("enemyAttack")
    }
}

function gravityFall(target){
    if(target.vy < target.friction*37 && (!isOnLadder(target) && !isOnPlatform(target)) && (target.y <= height-30)){
        target.vy += target.friction*physDelta
    }
}

function keyPressed() {
    moveKeys()
}
// function 

function moveKeys(){
    if (keyCode === UP_ARROW) {
        if(isOnLadder(game.player)){
            game.player.vy = -config.playerSpeed*physDelta;
        }
        else if(game.player.jumpTimer<1){
            game.player.vy = -config.playerSpeed*1.5*physDelta;
            game.player.jumpTimer = game.player.jumpTimerReset
        }
        // game.player.vy = -config.playerSpeed;
    } else if (keyCode === DOWN_ARROW) {
        game.player.vy = config.playerSpeed*physDelta;
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
    let bottom = target.y+target.h
    // implement ladder detection
    return false;
}

function isOnPlatform(target){
    // implement ladder detection
    let bottom = target.y+target.h
    let collisionCheck = false
    
    // check entire bottom side
    // for(let i=0; i+1; i<=target.w){
        // let p = i;

    // }
    
    return collisionCheck
}

function wallcheck(target){
    // implement ladder detection
    let bottom = target.y+target.h
    let collisionCheck = false
    
    // check entire side
    for(let i=0; i+1; i<=target.h){
        // let p = i;
    }
    
    return collisionCheck
}
function gameOver(reason){
    // todo: reset game state
    if (game.lives<=0){
        game.scene = "gameOver";
    } else {
        game.lives -=1;

    }
}