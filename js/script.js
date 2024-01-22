import {
    clearCanvas, clearAnswerPlace,
    openPage, closePage, createCoordsSystemOnCanvas,
    createCanvas, createContext,showAnswerForPointAndLine,
    showAnswerForLineAndLine,
} from './function.js';

// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-btn');

// ---- FOR PointAndLine ----
let btnSubmit = null;
let form = null;

// создание параграфа для ответа
let answerPlace = null;

// создание контекста канвы
let canvas = null;
let ctx = null;

// ---- FOR MAIN ----
// открытие окна
pages.addEventListener('click', () => {
    const currentWin = openPage(event, closeBtn);
    // создание канвы
    const canvasPlace = currentWin.querySelector('.picture');
    canvas = createCanvas(canvasPlace, 525, 525);
    ctx = createContext(canvas);
    // создание координатных осей
    createCoordsSystemOnCanvas(canvas, ctx);
    // место для ответа
    answerPlace = currentWin.querySelector('.answer');
    form = currentWin.querySelector('form')
    btnSubmit = currentWin.querySelector('.btn');
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        clearCanvas(canvas, ctx);
        clearAnswerPlace(answerPlace);
        if (btnSubmit.classList.contains("pointAndLine"))
            showAnswerForPointAndLine(form,answerPlace,canvas,ctx);
        if(btnSubmit.classList.contains("lineAndLine"))
            showAnswerForLineAndLine(form,answerPlace,canvas,ctx);
    });
   });
// закрытие окна
closeBtn.addEventListener('click', closePage);

// ---- FOR PointAndLine ----





