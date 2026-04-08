// dvd

let width = 640;
let height = 480;
let x = 10;
let y = 10;
let w = 72;
let h = 44;
let dx = 3.14;
let dy = 2;

let colorArray = [
    [255,255,255], //white
    [0,0,170.6], //blue
    [0,170.6,0], //green
    [0,170.6,170.6], //cyan
    [170.6,0,0], //red
    [170.6,0,170.6], //magenta
    [170.6,85.3,0], //dark yellow/brown (early monitors had this be a yellow (#aaaa00 instead of #aa5500), but starting with the ibm 5153 it became brown, and all newer cards running in backwards comapability modes kept it brown)
    [85.3,85.3,85.3], // gray
    [170.6,170.6,170.6], // light gray
    [85.3,85.3,255], //light blue
    [85.3,255,85.3], //light green
    [85.3,255,255], //light cyan
    [255,85.3,85.3], //light red
    [255,85.3,255], //light magenta
    [255,255,85.3], //light yellow
]
let fillColorIndex=0
let bgColor = "black"



function setup(){
    createCanvas(width, height);
    dx=PI
    dy = Math.E
}

function draw(){
    clear();
    background(0)
    fill(colorArray[fillColorIndex]);
    rect(x,y,w,h, 4);
    fill("black");
    textSize(28);
    text("DVD", x+1+w*0.075, y+5+h*0.5);
    ellipse(x+w*0.5, y+9+h*0.6, w*0.8, 10)
    fill(colorArray[fillColorIndex]);
    ellipse(x+w*0.5, y+9+h*0.6, w*0.15, 4)

    //collision logic
    if(x+w<width && x>0){
        x += dx;
    } 
    else{
        // dx *=-1
        dx = invertVary(dx)
        x += dx;
        colorCycle()
    }
    if(y+h<height && y>0){
        y+= dy;
    }
    else{
        // dy *=-1
        dy = invertVary(dy)
        y += dy;
        colorCycle()
    }
}

function colorCycle(){
    if (fillColorIndex >= colorArray.length - 1){
        fillColorIndex = 0
    }
    else {
        fillColorIndex +=1
    }
}

function invertVary(input){
    // calc a random offset
    let calc = random(0.66, 1.33)
    // to make sanity checks easier
    let abIn = abs(input)
    let value = abIn * calc
    // sanity enforcement
    let final = constrain(value, 0.25, 6)
    // if the input was positive, invert it
    if (input>0){
        return(final*-1)
    }
    else {
        return(final)
    }
}