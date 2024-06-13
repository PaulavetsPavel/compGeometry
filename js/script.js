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
	grahamScanAnimated,
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

	if (currentWin.classList.contains('jarvis')) {
		let points = [];
		let hull = [];
		let isAnimating = false;
		let animationFrameId;
		let delay = 500; // Задержка в миллисекундах
		let currentPoint;
		let nextPoint;
		let nextIndex;

		// Функция для отрисовки точек
		function drawPoints() {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
			points.forEach((point) => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
				ctx.fill();
			});
		}

		// Функция для отрисовки выпуклой оболочки
		function drawConvexHull(hull) {
			if (hull.length > 0) {
				ctx.beginPath();
				ctx.moveTo(hull[0].x, hull[0].y);
				hull.forEach((point) => ctx.lineTo(point.x, point.y));
				ctx.closePath();
				ctx.stroke();
			}
		}

		// Функция для вычисления ориентации (поиск поворотов)
		function orientation(p, q, r) {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
			return val === 0 ? 0 : val > 0 ? 1 : 2;
		}

		// Функция для выполнения одного шага алгоритма Джарвиса
		function jarvisMarchStep() {
			if (hull.length === 0) {
				// Найти самую левую точку
				currentPoint = points.reduce((leftmost, point) => (point.x < leftmost.x ? point : leftmost), points[0]);
				hull.push(currentPoint);
				nextPoint = points[0];
				nextIndex = 0;
			} else {
				for (let i = 0; i < points.length; i++) {
					if (orientation(currentPoint, nextPoint, points[i]) === 2 || nextPoint === currentPoint) {
						nextPoint = points[i];
						nextIndex = i;
					}
				}

				if (nextPoint === hull[0]) {
					isAnimating = false;
				} else {
					hull.push(nextPoint);
					currentPoint = nextPoint;
					nextPoint = points[0];
					nextIndex = 0;
				}
			}
		}

		// Функция для анимации
		function animate() {
			if (!isAnimating) return;

			jarvisMarchStep();
			drawPoints();
			drawConvexHull(hull);

			if (nextIndex < points.length) {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(points[nextIndex].x, points[nextIndex].y, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'black';
			}

			animationFrameId = setTimeout(animate, delay);
		}

		document.getElementById('startButton').addEventListener('click', () => {
			if (!isAnimating && points.length > 2) {
				isAnimating = true;
				hull = [];
				currentPoint = undefined;
				nextPoint = undefined;
				nextIndex = 0;
				clearTimeout(animationFrameId);
				animate();
			}
		});

		document.getElementById('stopButton').addEventListener('click', () => {
			isAnimating = false;
			clearTimeout(animationFrameId);
		});

		canvas.addEventListener('click', (event) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			points.push({ x, y });
			drawPoints();
		});

		drawPoints();
	}

	if (currentWin.classList.contains('greham')) {
		let points = [];
		let hull = [];
		let isAnimating = false;
		let animationFrameId;
		let currentIndex = 0;
		let delay = 1000; // Задержка в миллисекундах

		// Функция для отрисовки точек
		function drawPoints() {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
			points.forEach((point) => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
				ctx.fill();
			});
		}

		// Функция для отрисовки выпуклой оболочки
		function drawConvexHull(hull) {
			if (hull.length > 0) {
				ctx.beginPath();
				ctx.moveTo(hull[0].x, hull[0].y);
				hull.forEach((point) => ctx.lineTo(point.x, point.y));
				ctx.closePath();
				ctx.stroke();
			}
		}

		// Функция для вычисления ориентации (поиск поворотов)
		function orientation(p, q, r) {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
			return val === 0 ? 0 : val > 0 ? 1 : 2;
		}

		// Функция для сортировки точек по полярному углу относительно начальной точки
		function polarAngleSort(points, start) {
			return points.slice().sort((a, b) => {
				const order = orientation(start, a, b);
				if (order === 0) {
					return Math.hypot(start.x - a.x, start.y - a.y) - Math.hypot(start.x - b.x, start.y - b.y);
				}
				return order === 2 ? -1 : 1;
			});
		}

		// Функция для выполнения одного шага алгоритма Грэхема
		function grahamScanStep() {
			if (currentIndex < points.length) {
				while (
					hull.length >= 2 &&
					orientation(hull[hull.length - 2], hull[hull.length - 1], points[currentIndex]) !== 2
				) {
					hull.pop();
				}
				hull.push(points[currentIndex]);
				currentIndex++;
			} else {
				isAnimating = false;
			}
		}

		// Функция для анимации
		function animate() {
			if (!isAnimating) return;

			grahamScanStep();
			drawPoints();
			drawConvexHull(hull);

			if (currentIndex < points.length) {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(points[currentIndex].x, points[currentIndex].y, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'black';
			}

			setTimeout(animate, delay);
		}

		document.getElementById('startButtonGr').addEventListener('click', () => {
			if (!isAnimating && points.length > 2) {
				isAnimating = true;
				hull = [];
				currentIndex = 0;
				points = polarAngleSort(
					points,
					points.reduce(
						(left, point) => (point.y < left.y || (point.y === left.y && point.x < left.x) ? point : left),
						points[0],
					),
				);
				cancelAnimationFrame(animationFrameId);
				animate();
			}
		});

		document.getElementById('stopButtonGr').addEventListener('click', () => {
			isAnimating = false;
			clearTimeout(animationFrameId);
		});

		canvas.addEventListener('click', (event) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			points.push({ x, y });
			drawPoints();
		});

		drawPoints();
	}

	if (currentWin.classList.contains('hill')) {
		let points = [];
		let hull = [];
		let isAnimating = false;
		let delay = 500; // Задержка в миллисекундах
		let currentPoint;
		let nextPoint;
		let nextIndex;

		// Инициализация canvas и контекста

		// Функция для отрисовки точек
		function drawPoints() {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
			points.forEach((point) => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
				ctx.fill();
			});
		}

		// Функция для отрисовки выпуклой оболочки
		function drawConvexHull(hull) {
			if (hull.length > 0) {
				ctx.beginPath();
				ctx.moveTo(hull[0].x, hull[0].y);
				hull.forEach((point) => ctx.lineTo(point.x, point.y));
				ctx.closePath();
				ctx.stroke();
			}
		}

		// Функция для вычисления ориентации (поиск поворотов)
		function orientation(p, q, r) {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
			return val === 0 ? 0 : val > 0 ? 1 : 2;
		}

		// Функция для выполнения одного шага алгоритма Джарвиса
		function jarvisMarchStep() {
			if (hull.length === 0) {
				// Найти самую левую точку
				currentPoint = points.reduce((leftmost, point) => (point.x < leftmost.x ? point : leftmost), points[0]);
				hull.push(currentPoint);
				nextPoint = points[0];
				nextIndex = 0;
			} else {
				for (let i = 0; i < points.length; i++) {
					if (orientation(currentPoint, nextPoint, points[i]) === 2 || nextPoint === currentPoint) {
						nextPoint = points[i];
						nextIndex = i;
					}
				}

				if (nextPoint === hull[0]) {
					isAnimating = false;
				} else {
					hull.push(nextPoint);
					currentPoint = nextPoint;
					nextPoint = points[0];
					nextIndex = 0;
				}
			}
		}

		// Функция для анимации
		function animate() {
			if (!isAnimating) return;

			jarvisMarchStep();
			drawPoints();
			drawConvexHull(hull);

			if (nextIndex < points.length) {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(points[nextIndex].x, points[nextIndex].y, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'black';
			}

			setTimeout(animate, delay);
		}

		function pointInPolygon(point, polygon) {
			let x = point.x,
				y = point.y;
			let inside = false;
			for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
				let xi = polygon[i].x,
					yi = polygon[i].y;
				let xj = polygon[j].x,
					yj = polygon[j].y;
				let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
				if (intersect) inside = !inside;
			}
			return inside;
		}

		function updateHull(newPoint) {
			if (!pointInPolygon(newPoint, hull)) {
				hull = [];
				currentPoint = undefined;
				nextPoint = undefined;
				nextIndex = 0;
				isAnimating = true;
				animate();
			}
		}

		canvas.addEventListener('click', (event) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			const newPoint = { x, y };
			points.push(newPoint);
			drawPoints();

			if (points.length > 2) {
				if (!pointInPolygon(newPoint, hull)) {
					isAnimating = false;
					hull = [];
					currentPoint = undefined;
					nextPoint = undefined;
					nextIndex = 0;
					isAnimating = true;
					animate();
				} else {
					drawConvexHull(hull);
				}
			}
		});

		drawPoints();
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
		if (btnSubmit.classList.contains('jarAlg')) {
			grahamScanAnimated(points, canvas, ctx);
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
