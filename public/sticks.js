// Gergely Aliz, 521/2
const coord = [
  [450, 50, 50, 60],
  [150, 20, 90, 80],
  [25, 10, 275, 90],
  [0, 60, 290, 50],
  [0, 40, 290, 40],
  [90, 10, 210, 90],
  [20, 10, 250, 90],
  [80, 10, 50, 90],
  [30, 10, 299, 90],
  [500, 10, 60, 90],
];

const colors = [
  '#FF0000',
  '#FF8000',
  '#FFFF00',
  '#00FF00',
  '#009900',
  '#0080FF',
  '#000066',
  '#99004C',
  '#FF66B2',
  '#660066',
];

const visited = new Array(10).fill(false);
const randomOrder = [];
const randomDict = {};

let lifespan = 3;

function drawLine([x1, y1, x2, y2], color, ctx) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function colorPicker() {
  let index = Math.floor(Math.random() * 10);
  while (visited[index] === true) {
    index = Math.floor(Math.random() * 10);
  }
  visited[index] = true;
  randomOrder.unshift(index);
  return colors[index];
}

function removeLine(index, ctx) {
  ctx.clearRect(0, 0, 300, 100);
  delete randomDict[colors[index]];

  Object.keys(randomDict).forEach((key) => {
    drawLine(randomDict[key], key, ctx);
  });
  randomOrder.shift();
}

function printMessage(message, color, ctx) {
  ctx.clearRect(0, 0, 300, 100);
  ctx.strokeStyle = color;
  ctx.font = '30px Arial';
  ctx.strokeText(message, 50, 50);
}

function changeText() {
  let message = 'Life: ';
  for (let i = lifespan; i > 0; i--) {
    message += '❤️';
  }
  const element = document.getElementById('lifespan');
  element.innerHTML = message;
}

function stickPicker(index, ctx) {
  console.log('index picked: ', index);
  if (index === randomOrder[0]) {
    console.log('CORRECT GUESS');
    removeLine(index, ctx);
    if (randomOrder.length === 0) {
      printMessage('YOU WON!', 'green', ctx);
    }
    console.log('random order', randomOrder);
  } else {
    console.log('WRONG QUESS');
    lifespan--;
    changeText();
    if (lifespan === 0) {
      printMessage('GAME OVER', 'red', ctx);
    }
  }
}

let canvas = '';
let buttons = [];
let ctx = '';
window.onload = function main() {
  canvas = document.getElementById('myCanvas');
  try {
    ctx = canvas.getContext('2d');
    console.log('SUCCESS: getContext()');
    for (let i = 0; i < coord.length; i++) {
      const color = colorPicker();
      drawLine(coord[i], color, ctx);
      randomDict[color] = coord[i];
    }

    console.log('SUCCESS: drawLine()');
    console.log(randomOrder);
  } catch {
    console.log('CANVAS: confused unga-bunga');
  }
  try {
    buttons = Array.from(document.getElementsByClassName('button-color'));
    buttons.forEach((button, index) => {
      button.style.backgroundColor = colors[index];
      button.addEventListener('click', () => {
        stickPicker(index, ctx);
      });
    });
  } catch {
    console.log('BUTTONS: confused unga-bunga');
  }
};
