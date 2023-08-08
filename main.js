// width="300" height="100"
//     x            y

const coord = [[50, 50, 150, 60],
               [150, 20,90,80],
               [25, 10, 275, 90],
               [0,60,290,50],
               [0, 40, 290, 40],
               [90, 10, 210, 90], 
               [20, 10, 250, 90], 
               [80, 10, 50, 90], 
               [30, 10, 27, 90],
               [40, 10, 60, 90] 
            ];

const colors = ["#FF0000",
                "#FF8000",
                "#FFFF00",
                "#00FF00",
                "#009900",
                "#0080FF",
                "#000066",
                "#99004C",
                "#FF66B2",
                "#660066"              
            ];

let visited = new Array(10).fill(false)

let random_order = [];
let random_dict = {};

function drawLine([x1,y1,x2,y2],color,ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function colorPicker(){
    index = Math.floor(Math.random() * 10);
    while (visited[index] == true){
        index = Math.floor(Math.random() * 10);
    }
    visited[index] = true;
    random_order.unshift(index);
    return colors[index];
}

function removeLine(index,ctx){
    ctx.clearRect(0, 0, 300, 100);
    delete random_dict[colors[index]];
    
    for (const key in random_dict){
        drawLine(random_dict[key],key,ctx);
    }
    random_order.shift();
    
}

function stickPicker(index,ctx){
    console.log("index picked: ", index);
    if (index == random_order[0]){
        console.log("CORRECT GUESS");
        removeLine(index,ctx);
        if (random_order.length == 0){
            printMessage("YOU WON!","green",ctx);
        }
        console.log("random order",random_order);
    }
    else{
        console.log("WRONG QUESS");
        lifespan --;
        changeText(lifespan);
        if (lifespan == 0){
            printMessage("GAME OVER","red",ctx);
        }
    }
}

function printMessage(message, color, ctx){
    ctx.clearRect(0, 0, 300, 100);
    ctx.strokeStyle = color;
    ctx.font = "30px Arial";
    ctx.strokeText(message, 50, 50);
}

let lifespan = 3
function changeText(lifespan){
    let message = "Life: ";
    for (let i = lifespan; i> 0; i--){
        message += "❤️";
    }
    let element = document.getElementById("lifespan");
    element.innerHTML = message;
}


let canvas="";
let buttons = [];
let ctx = "";
window.onload = function() {
    canvas = document.getElementById("myCanvas");
    try {

        ctx = canvas.getContext('2d');
        console.log("SUCCESS: getContext()");
        for (let i=0; i< coord.length; i++){
            let color = colorPicker();
            drawLine(coord[i],color,ctx);
            random_dict[color] = coord[i];
        }
        
        console.log("SUCCESS: drawLine()");
        console.log(random_order);
    }
    catch {
        console.log("CANVAS: confused unga-bunga");
    }
    try {
        buttons = Array.from(document.getElementsByClassName("button-color"));
        buttons.forEach((button, index) => {
            button.style.backgroundColor = colors[index];
            button.addEventListener("click", () => {
                stickPicker(index,ctx);
              });
          });
    }
    catch{
        console.log("BUTTONS: confused unga-bunga");
    }
    
}


