import {
    clearCanvas, clearAnswerPlace,
    openPage, closePage, createCoordsSystemOnCanvas,
    createCanvas, createContext, showAnswerForPointAndLine,
    showAnswerForLineAndLine,
} from './function.js';

const X_MIN = -2;
const X_MAX = 50;
// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-btn');
let currentWin;
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
    const form = currentWin.querySelector('form');
    const btnSubmit = currentWin.querySelector('.btn');

    btnSubmit.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearCanvas(canvas, ctx);
        clearAnswerPlace(answerPlace);

        if (btnSubmit.classList.contains('pointAndLine'))
            showAnswerForPointAndLine(form, answerPlace, canvas, ctx, X_MIN, X_MAX);
        if (btnSubmit.classList.contains('lineAndLine'))
            showAnswerForLineAndLine(form, answerPlace, canvas, ctx, X_MIN, X_MAX);
    });
});
// закрытие окна
closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closePage(closeBtn);
    canvasPlace.innerHTML = '';
    answerPlace.innerHTML = '';
    const inputs = currentWin.querySelectorAll('input[type=number]');
    for (const input of inputs) {
        input.value=''
    }
});







