import {
    clearCanvas, clearAnswerPlace,
    openPage, closePage, createCoordsSystemOnCanvas,
    createCanvas, createContext, showAnswerForPointAndLine,
    showAnswerForLineAndLine, showAnswerForPointAndSimpleFigure
} from './function.js';


const X_MIN = -2;
const X_MAX = 50;
// для удаления скобок и запятых в textarea.value для создания массива точек
const regExpDelBrackets = /[();, ]/;

// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-btn');
let currentWin = null;
let form = null;
let inputs = null;
let inputsValue = null;
let textareaValue = null;
let canvasPlace = null;
let answerPlace = null
;
// ---- FOR MAIN ----
// открытие окна
pages.addEventListener('click', (event) => {
    event.preventDefault();
    currentWin = openPage(event, closeBtn);
    form = currentWin.querySelector('form');
    // создание канвы
    canvasPlace = currentWin.querySelector('.picture');
    const canvas = createCanvas(canvasPlace, 525, 525);
    const ctx = createContext(canvas);
    // создание координатных осей
    createCoordsSystemOnCanvas(canvas, ctx);
    // место для ответа
    answerPlace = currentWin.querySelector('.answer');

    inputs = form.querySelectorAll('input[type=number]');


    const btnSubmit = currentWin.querySelector('.btn');
    btnSubmit.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearCanvas(canvas, ctx);
        clearAnswerPlace(answerPlace);

        // т. к. querySelectorAll всегда возвращает NodeList
        inputsValue = (inputs.length !== 0) ? Array.from(inputs).map(input => input.value) : null;
        // querySelector вернет undefined если не найдет textarea
        textareaValue = form.querySelector(`textarea[name='pointsCoords']`)?.value
            .split(regExpDelBrackets).filter(elem => elem !== '');

        const points = [];
        (inputsValue ?? textareaValue).forEach((element, index, array) => {
            if (index % 2 === 0) {
                points.push([+element, +(array[index + 1])]);
            }
        });

        if (btnSubmit.classList.contains('pointAndLine')) {
            showAnswerForPointAndLine(points, answerPlace, canvas, ctx, X_MIN, X_MAX);
        }
        if (btnSubmit.classList.contains('lineAndLine')) {
            showAnswerForLineAndLine(points, answerPlace, canvas, ctx);
        }
        if (btnSubmit.classList.contains('pointAndSimpleFigure')) {
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

    for (const input of inputs) {
        input.value = '';
    }
});







