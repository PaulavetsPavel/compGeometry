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

export {
	showAnswerForPointAndLine,
	showAnswerForLineAndLine,
	showAnswerForPointAndSimpleFigure,
	showAnswerForPointAndConvexFigure,
};
