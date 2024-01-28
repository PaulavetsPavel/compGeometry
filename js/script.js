import {
  clearCanvas, clearAnswerPlace,
  openPage, closePage, createCoordsSystemOnCanvas,
  createCanvas, createContext, showAnswerForPointAndLine,
  showAnswerForLineAndLine,showAnswerForPointAndSimpleFigure
} from './function.js';


const X_MIN = -2;
const X_MAX = 50;
// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-btn');
let currentWin;
let inputs;
let canvasPlace;
let answerPlace;
// ---- FOR MAIN ----
// открытие окна
pages.addEventListener('click', (event) => {
  event.preventDefault();
  currentWin = openPage(event, closeBtn);
  // создание канвы
  canvasPlace = currentWin.querySelector('.picture');
  const canvas = createCanvas(canvasPlace, 525, 525);
  const ctx = createContext(canvas);
  // создание координатных осей
  createCoordsSystemOnCanvas(canvas, ctx);
  // место для ответа
  answerPlace = currentWin.querySelector('.answer');
  inputs = currentWin.querySelector('form').querySelectorAll('input[type=number]');
  const btnSubmit = currentWin.querySelector('.btn');
  btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearCanvas(canvas, ctx);
    clearAnswerPlace(answerPlace);
    
    const points = [];
    inputs.forEach((input, index) => {
      if(index % 2 === 0) {
        points.push([ +inputs[ index ].value, +inputs[ index + 1 ].value ]);
      }
    });
    
    if(btnSubmit.classList.contains('pointAndLine')) {
      showAnswerForPointAndLine(points, answerPlace, canvas, ctx, X_MIN, X_MAX);
    }
    if(btnSubmit.classList.contains('lineAndLine')) {
      showAnswerForLineAndLine(points, answerPlace, canvas, ctx);
    }
    if(btnSubmit.classList.contains('pointAndSimpleFigure')) {
      const points=[[2,6],[5,7],[8,9],[4,8],[7,2],[5,4],[5,5],[4,10]]
      showAnswerForPointAndSimpleFigure(points, answerPlace, canvas, ctx);
    }
  });
});
// закрытие окна
closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  closePage(closeBtn);
  canvasPlace.innerHTML = '';
  answerPlace.innerHTML = '';
  
  for(const input of inputs) {
    input.value = '';
  }
});







