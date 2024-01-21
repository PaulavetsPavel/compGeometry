import {clearCanvas, clearAnswerPlace,
    showPoint, showLine, searchLocationPoint,
    openPage, closePage} from './function.js';

// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-page');

// ---- FOR PointAndLine ----
const pointSubmit = document.querySelector('#pointSubmit');
const form = document.querySelector('form');
// создание параграфа для ответа
const answerPlacePointAndLine = document.querySelector('.answer');
const answerTextPointAndLine = document.createElement('p');
// создание контекста канвы
const canvasPointAndLine = document.querySelector('#canvasPointAndLine');
const contextPointAndLine = canvasPointAndLine.getContext('2d');

// ---- FOR MAIN ----
pages.addEventListener('click', () => openPage(event, closeBtn, canvasPointAndLine, contextPointAndLine));
closeBtn.addEventListener('click', closePage);

// ---- FOR PointAndLine ----
pointSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    clearCanvas(canvasPointAndLine, contextPointAndLine);
    clearAnswerPlace(answerPlacePointAndLine, answerTextPointAndLine);
    const point = [form.pointX.value, form.pointY.value];
    const line = [[form.lineStartX.value, form.lineStartY.value], [form.lineEndX.value, form.lineEndY.value]];

    answerTextPointAndLine.innerText = searchLocationPoint(point, line);
    answerPlacePointAndLine.appendChild(answerTextPointAndLine);

    showPoint(canvasPointAndLine, contextPointAndLine, point, 'p0');
    showPoint(canvasPointAndLine, contextPointAndLine, line[0], 'p1');
    showPoint(canvasPointAndLine, contextPointAndLine, line[1], 'p2');
    showLine(canvasPointAndLine, contextPointAndLine, line);
});




