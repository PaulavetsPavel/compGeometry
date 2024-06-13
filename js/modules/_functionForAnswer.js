import {
	showPoint,
	showLine,
	getYfromEquationOfLine,
	checkArrayIsZero,
	isIntersectLines,
	determinant,
	getVector,
	getVectorNormal,
	getScalarProductVectors,
	isConvexFigure,
	getVectorProductVectors,
	isPointInConvexPolygon,
	clearCanvas,
	createCoordsSystemOnCanvas,
} from './_function.js';

function showAnswerForPointAndLine(points, answerPlace, canvas, ctx, xMin, xMax) {
	const [point, line] = [points[0], [points[1], points[2]]];
	const answerText = document.createElement('p');

	// проверка введенных данных (массив одно уровневых массивов)
	if (!!checkArrayIsZero([point, ...line])) {
		answerText.innerText = `Введите данные`;
	} else {
		const det = determinant([point, ...line]);
		const place = det > 0 ? 'левее' : det < 0 ? 'правее' : 'на';

		answerText.innerText = `Точка расположена ${place} прямой`;
		points.forEach((point, index) => {
			showPoint(canvas, ctx, point, `p${index}`);
		});
		showLine(canvas, ctx, [
			[xMin, getYfromEquationOfLine(line, xMin)],
			[xMax, getYfromEquationOfLine(line, xMax)],
		]);
	}
	answerPlace.appendChild(answerText);
}

function showAnswerForLineAndLine(points, answerPlace, canvas, ctx, xMin, xMax) {
	const [firstLine, secondLine] = [
		[points[0], points[1]],
		[points[2], points[3]],
	];
	const answerText = document.createElement('p');

	if (!!checkArrayIsZero([...firstLine, ...secondLine])) {
		answerText.innerText = `Введите данные`;
	} else {
		const lineIntersection = isIntersectLines(firstLine, secondLine);

		switch (lineIntersection) {
			case 'inLine':
				// если отрезки лежат на одной прямой
				// проверка отрезков на принадлежность одного другому
				if (
					(secondLine[0][0] <= firstLine[1][0] &&
						secondLine[0][1] <= firstLine[1][1] &&
						secondLine[0][0] >= firstLine[0][0] &&
						secondLine[0][1] >= firstLine[0][1]) ||
					(secondLine[1][0] <= firstLine[1][0] &&
						secondLine[1][1] <= firstLine[1][1] &&
						secondLine[1][0] >= firstLine[0][0] &&
						secondLine[1][1] >= firstLine[0][1])
				) {
					answerText.innerText = 'Отрезки лежат на одной прямой и пересекаются';
				}
				if (
					(secondLine[0][0] > firstLine[1][0] && secondLine[0][1] > firstLine[1][1]) ||
					(secondLine[1][0] < firstLine[0][0] && secondLine[1][1] < firstLine[0][1])
				) {
					answerText.innerText = 'Отрезки лежат на одной прямой и не пересекаются';
				}
				break;
			case 'intersect':
				// получаем вектор прямой
				const p3p4 = getVector(points[2], points[3]);
				const p3p1 = getVector(points[2], points[0]);
				// n - вектор нормали для первой прямой
				const n = getVectorNormal(points[0], points[1]);
				// параметр для нахождения точки пересечения отрезков
				// parametr=(p3p1*n)/(p3p4*n)
				const param = (getScalarProductVectors(p3p1, n) / getScalarProductVectors(p3p4, n)).toFixed(4);
				const pointIntersection = [
					Math.ceil(points[2][0] + p3p4[0] * param),
					Math.ceil(points[2][1] + p3p4[1] * param),
				];

				answerText.innerText = `Отрезки пересекаются в точке:  p(${pointIntersection[0]},${pointIntersection[1]}) `;
				break;
			case 'notIntersect':
				answerText.innerText = 'Отрезки не пересекаются';
				break;
		}
	}

	points.forEach((point, index) => {
		showPoint(canvas, ctx, point, `p${index}`);
	});
	[firstLine, secondLine].forEach((line) => {
		showLine(canvas, ctx, line);
	});
	answerPlace.appendChild(answerText);
}

function showAnswerForPointAndSimpleFigure(points, answerPlace, canvas, ctx, xMin) {
	// координаты точки
	const p0 = points[0];
	// точки для определения направления векторов граней против часовой стрелки
	const peacks = [...points.slice(1)].reverse();
	// получаем все грани по направлению против часовой стрелки
	const edges = [];
	[...peacks, peacks[0]].forEach((point, index, points) => {
		if (index !== points.length - 1) edges.push([point, points[index + 1]]);
	});
	// получаем векторы граней
	const edgesVectorsCounterClockWiseDirection = edges.map((line) => getVector(...line));
	// получаем векторные произведения всех пар граней
	const allVectorProductVectors = [];
	edgesVectorsCounterClockWiseDirection.forEach((vector, index, vectors) => {
		if (index === vectors.length - 1) {
			allVectorProductVectors.push(getVectorProductVectors(vector, vectors[0]));
		} else {
			allVectorProductVectors.push(getVectorProductVectors(vector, vectors[index + 1]));
		}
	});
	const answerText = document.createElement('p');
	// проверяем является ли фигура выпуклой (все векторные произведения должны быть одного знака),
	// от этого зависит алгоритм проверки
	const convexFigure = isConvexFigure(allVectorProductVectors);
	// если фигура не выпуклая,
	// определять положение точки будем при помощи лучевого теста
	// в зависимости от количества пересечений лучем граней фигуры будет зависеть то, где расположена точка
	// если луч пересек грани четное количество раз, значит точка лежит за пределами фигуры
	if (!convexFigure) {
		// рисуем луч для определения положения точки
		// xMin задаем произвольно, за пределами фигуры
		const tempRay = [[xMin, p0[1]], p0];
		showLine(canvas, ctx, tempRay);
		// проверяем прошел ли луч через какие-либо вершины
		// получаем массив определителей луча с каждой вершиной
		const detsRayAndPeacks = peacks.map((peack) => {
			return determinant([peack, tempRay]);
		});

		// проверяем сколько граней пересек луч
		const arrRayAndEdgesIntersection = edges.map((edge) => {
			return isIntersectLines(edge, tempRay);
		});
		const countEdgesIntersectionRay = arrRayAndEdgesIntersection.reduce((acc, el) => {
			if (el === 'intersect') return ++acc;
			else return acc;
		}, 0);
		if (countEdgesIntersectionRay % 2 === 0) {
			answerText.innerText = 'Точка находится вне фигуры';
		} else {
			answerText.innerText = 'Точка находится внутри фигуры';
		}
	} else if (!!convexFigure) {
		answerText.innerText = 'Фигура выпуклая. Опишите другую фигуру';
	}
	answerPlace.appendChild(answerText);

	points.forEach((point, index) => {
		showPoint(canvas, ctx, point, `p${index}`);
	});

	edges.forEach((edge) => {
		showLine(canvas, ctx, edge);
	});
}

function showAnswerForPointAndConvexFigure(points, answerPlace, canvas, ctx) {
	// координаты точки
	const p0 = points[0];
	const polygon = [...points.slice(1)];
	// точки для определения направления векторов граней против часовой стрелки
	const peacks = [...polygon].reverse();
	// получаем все грани по направлению против часовой стрелки
	const edges = [];
	[...peacks, peacks[0]].forEach((point, index, points) => {
		if (index !== points.length - 1) edges.push([point, points[index + 1]]);
	});
	// получаем векторы граней
	const edgesVectorsCounterClockWiseDirection = edges.map((line) => getVector(...line));
	// получаем векторные произведения всех пар граней
	const allVectorProductVectors = [];
	edgesVectorsCounterClockWiseDirection.forEach((vector, index, vectors) => {
		if (index === vectors.length - 1) {
			allVectorProductVectors.push(getVectorProductVectors(vector, vectors[0]));
		} else {
			allVectorProductVectors.push(getVectorProductVectors(vector, vectors[index + 1]));
		}
	});
	const answerText = document.createElement('p');
	// проверяем является ли фигура выпуклой (все векторные произведения должны быть одного знака),
	// от этого зависит алгоритм проверки
	const convexFigure = isConvexFigure(allVectorProductVectors);
	// если фигура не выпуклая,
	if (!convexFigure) {
		answerText.innerText = 'Фигура не выпуклая. Опишите другую фигуру';
	} else {
		isPointInConvexPolygon(p0, polygon)
			? (answerText.innerText = 'Точка находится внутри фигуры')
			: (answerText.innerText = 'Точка находится вне фигуры');
	}

	answerPlace.appendChild(answerText);

	points.forEach((point, index) => {
		showPoint(canvas, ctx, point, `p${index}`);
	});

	edges.forEach((edge) => {
		showLine(canvas, ctx, edge);
	});
}
function grahamScanAnimated(points, canvas, ctx) {
	function findLowestPoint(points) {
		return points.reduce((lowest, point) => {
			return point[1] < lowest[1] || (point[1] === lowest[1] && point[0] < lowest[0]) ? point : lowest;
		}, points[0]);
	}

	function polarAngle(p0, p1) {
		return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
	}

	function distance(p0, p1) {
		return Math.pow(p1[0] - p0[0], 2) + Math.pow(p1[1] - p0[1], 2);
	}

	function sortPointsByPolarAngle(points, lowest) {
		points.sort((a, b) => {
			let angleA = polarAngle(lowest, a),
				angleB = polarAngle(lowest, b);

			if (angleA === angleB) {
				return distance(lowest, a) - distance(lowest, b);
			}

			return angleA - angleB;
		});

		return points;
	}

	function isCounterClockwise(p0, p1, p2) {
		return (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]) > 0;
	}

	function drawPoint(ctx, point, color = 'black') {
		ctx.beginPath();
		ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}

	function drawLine(ctx, p0, p1, color = 'red') {
		ctx.beginPath();
		ctx.moveTo(p0[0], p0[1]);
		ctx.lineTo(p1[0], p1[1]);
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	if (points.length < 3) return;

	let lowest = findLowestPoint(points);
	points = sortPointsByPolarAngle(points, lowest);
	let stack = [lowest, points[1]];

	// Рисуем все точки
	points.forEach((point, index) => {
		showPoint(canvas, ctx, point, `p${index}`);
	});

	function processPoint(i) {
		if (i < points.length) {
			while (stack.length > 1 && !isCounterClockwise(stack[stack.length - 2], stack[stack.length - 1], points[i])) {
				stack.pop();
				showLine(canvas, ctx, [...i, ...(i + 1)]);
			}
			stack.push(points[i]);

			// Рисуем обновленную выпуклую оболочку
			clearCanvas(canvas, ctx);
			createCoordsSystemOnCanvas(canvas, ctx);
			points.forEach((point, index) => showPoint(canvas, ctx, point, `p${index}`));
			for (let j = 0; j < stack.length - 1; j++) {
				showLine(canvas, ctx, ...stack[j], ...stack[j + 1]);
			}

			setTimeout(() => processPoint(i + 1), 1500); // задержка для анимации
		} else {
			// Замыкаем оболочку
			showLine(canvas, ctx, ...stack[stack.length - 1], ...stack[0]);
		}
	}

	processPoint(0);
}

export {
	showAnswerForPointAndLine,
	showAnswerForLineAndLine,
	showAnswerForPointAndSimpleFigure,
	showAnswerForPointAndConvexFigure,
	grahamScanAnimated,
};
