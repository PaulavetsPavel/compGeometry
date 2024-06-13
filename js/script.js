import {
	clearCanvas,
	clearAnswerPlace,
	openPage,
	closePage,
	createCoordsSystemOnCanvas,
	createCanvas,
	createContext,
	createCordsInput,
} from './modules/_function.js';
import {
	showAnswerForPointAndLine,
	showAnswerForLineAndLine,
	showAnswerForPointAndSimpleFigure,
	showAnswerForPointAndConvexFigure,
} from './modules/_functionForAnswer.js';

const X_MIN = -2;
const X_MAX = 50;
// для удаления скобок и запятых в textarea.value для создания массива точек
const regExpDelBrackets = /[();, ]/;

// ---- FOR MAIN ----
const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-btn');
let currentWin = null;
let inputs = null;
let inputsValue = null;
let canvasPlace = null;
let answerPlace = null;
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

	// создание полей ввода для добавления точек
	if (currentWin.classList.contains('dynamic')) {
		const simpleFigure = currentWin.querySelector('.simpleFigure');
		const btnAddPoint = currentWin.querySelector('.addPoint');

		btnAddPoint.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();

			const dynamicCoordsInput = createCordsInput();
			simpleFigure.appendChild(dynamicCoordsInput);
			inputs = currentWin.querySelector('form').querySelectorAll('input[type=number]');
		});
	}

	const btnSubmit = currentWin.querySelector('.btn');
	btnSubmit.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		clearCanvas(canvas, ctx);
		clearAnswerPlace(answerPlace);

		inputsValue = Array.from(inputs).map((input) => +input.value);

		const points = [];
		inputsValue.forEach((value, index, array) => {
			if (index % 2 === 0) {
				points.push([+value, +array[index + 1]]);
			}
		});

		if (btnSubmit.classList.contains('pointAndLine')) {
			showAnswerForPointAndLine(points, answerPlace, canvas, ctx, X_MIN, X_MAX);
		}
		if (btnSubmit.classList.contains('lineAndLine')) {
			showAnswerForLineAndLine(points, answerPlace, canvas, ctx);
		}
		if (btnSubmit.classList.contains('pointAndSimpleFigure')) {
			showAnswerForPointAndSimpleFigure(points, answerPlace, canvas, ctx, X_MIN);
		}
		if (btnSubmit.classList.contains('pointAndConvexFigure')) {
			showAnswerForPointAndConvexFigure(points, answerPlace, canvas, ctx);
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
