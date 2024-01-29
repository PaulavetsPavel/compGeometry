function openPage(event, btn) {
    event.preventDefault();
    event.stopPropagation();
    // получение окна которое следует открыть
    const currentWin = event.target.closest('.page');
    // открытие текущего она
    currentWin.classList.toggle('full');
    // скрытие заголовка
    currentWin.children[0].classList.toggle('hide');
    // отображение контента окна
    currentWin.children[1].classList.toggle('hide');
    // запрет всплытия события клика по контенту
    currentWin.children[1].addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
    // появление кнопки закрытия
    btn.classList.toggle('hide');
    return currentWin;
}

function closePage(btn) {

    // скрытие кнопки закрытия окна
    btn.classList.toggle('hide');
    // скрытие контента окна
    btn.closest('div').querySelector('.full').firstElementChild.classList.toggle('hide');
    btn.closest('div').querySelector('.full').lastElementChild.classList.toggle('hide');
    // возврат окна к первоначальному состоянию через удаление класса
    btn.closest('div').querySelector('.full').classList.remove('full');
}

function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    createCoordsSystemOnCanvas(canvas, ctx);
}

function clearAnswerPlace(place) {
    place.innerHTML = '';
}

function createCanvas(canvasPlace, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = `${width}`;
    canvas.height = `${height}`;
    canvas.id = 'canvas';
    canvasPlace.appendChild(canvas);
    return canvas;
}

function createContext(canvas) {
    return canvas.getContext('2d');
}

function createCoordsSystemOnCanvas(canvas, ctx) {
    // создание оси y
    ctx.beginPath();
    ctx.moveTo(20, canvas.clientHeight - 10);
    ctx.lineTo(20, 10);
    ctx.moveTo(17, 18);
    ctx.lineTo(23, 18);
    // для дорисовки стрелочки
    ctx.lineTo(20, 10);
    ctx.fill();
    // создание делений и цифр
    for (let i = 30, j = 1; i < canvas.clientHeight - 20, j < 47; i += 10, j++) {
        ctx.moveTo(17, canvas.clientHeight - i - 3);
        ctx.lineTo(23, canvas.clientHeight - i - 3);
        if (j % 2 !== 1) {
            ctx.fillText(`${j}`, 3, canvas.clientHeight - i);
        }
    }
    ctx.fillText('y', 10, 15);
    // создание оси x
    ctx.moveTo(10, canvas.clientHeight - 20);
    ctx.lineTo(canvas.clientWidth - 10, canvas.clientHeight - 20);
    ctx.moveTo(canvas.clientWidth - 18, canvas.clientHeight - 23);
    ctx.lineTo(canvas.clientWidth - 18, canvas.clientHeight - 17);
    // для дорисовки стрелочки
    ctx.lineTo(canvas.clientWidth - 10, canvas.clientHeight - 20);
    ctx.fill();
    // создание делений и цифр
    for (let i = 30, j = 1; i < canvas.clientWidth - 20, j < 47; i += 10, j++) {
        ctx.moveTo(i, canvas.clientHeight - 23);
        ctx.lineTo(i, canvas.clientHeight - 17);
        if (j % 2 !== 1) {
            ctx.fillText(`${j}`, i - 4, canvas.clientHeight - 3, canvas.clientHeight - 3);
        }
    }
    ctx.fillText('x', canvas.clientWidth - 15, canvas.clientHeight - 7);
    ctx.fillText('0', 10, canvas.clientHeight - 7);
    ctx.stroke();
}

function createCordsInput() {
    const dynamicCoordsInput = document.createElement('div');
    dynamicCoordsInput.classList.add('dynamicCoordsInput');
    dynamicCoordsInput.innerHTML =
        ' <label>x: <input type="number" name="secondLineStartX" value=""></label>\n' +
        '<label>y: <input type="number" name="secondLineStartY" value=""></label>' + '<span>;</span>';
    return dynamicCoordsInput;
}

function showPoint(canvas, ctx, point, name) {
    let [pointX, pointY] = [...point];
    ctx.beginPath();
    ctx.moveTo(pointX * 10 + 20, canvas.clientHeight - 23 - pointY * 10);
    ctx.arc(pointX * 10 + 20, canvas.clientHeight - 23 - pointY * 10, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(name, pointX * 10 + 15, canvas.clientHeight - 30 - pointY * 10);

}

function showLine(canvas, ctx, line) {
    let [lineStartX, lineStartY] = [...line[0]];
    let [lineEndX, lineEndY] = [...line[1]];

    ctx.beginPath();
    ctx.moveTo(lineStartX * 10 + 20, canvas.clientHeight - 23 - lineStartY * 10);
    ctx.lineTo(lineEndX * 10 + 20, canvas.clientHeight - 23 - lineEndY * 10);
    ctx.stroke();
}

function determinant(points) {
    let [pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY] = [...points.flat()];

    return (lineEndX - lineStartX) * (pointY - lineStartY) - (pointX - lineStartX) * (lineEndY - lineStartY);
}

function getYfromEquationOfLine(line, x) {
    const [x1, y1] = [...line[0]];
    const [x2, y2] = [...line[1]];

    return (x - x1) * (y2 - y1) / (x2 - x1) + y1;
}

function checkArrayIsZero(array) {

    return array.flat().every(el => el === 0);
}

function isIntersectLines (array){
    return (array[0] * array[1] <= 0) && (array[2] * array[3] <= 0)
}
function getVector(pointStart, pointEnd) {
    return [pointEnd[0] - pointStart[0],
        pointEnd[1] - pointStart[1]];

}

function getVectorNormal(pointStart, pointEnd) {
    return [pointStart[1] - pointEnd[1],
        pointEnd[0] - pointStart[0]];
}

function getScalarProductVectors(pointStart, pointEnd) {
    return (pointStart[0] * pointEnd[0]) + (pointStart[1] * pointEnd[1]);
}

function getVectorProductVectors(vectorFirst, vectorSecond) {
    return (vectorFirst[0] * vectorSecond[1]) - (vectorFirst[1] * vectorSecond[0]);
}

function isConvexFigure(productVectors) {
    return productVectors.every(el => el > 0) || productVectors.every(el => el < 0);
}

function getAllVectorProductVectors(edgesVectors) {
    const allVectorProductVectors = [];
    edgesVectors.forEach((vector, index, vectors) => {
        if (index === vectors.length - 1) {
            allVectorProductVectors.push(getVectorProductVectors(vector, vectors[0]));
        } else {
            allVectorProductVectors.push(getVectorProductVectors(vector, vectors[index + 1]));
        }
    });
    return allVectorProductVectors;
}

function showAnswerForPointAndLine(points, answerPlace, canvas, ctx, xMin, xMax) {
    const [point, line] = [points[0], [points[1], points[2]]];
    const answerText = document.createElement('p');

    // проверка введенных данных (массив одно уровневых массивов)
    if (!!checkArrayIsZero([point, ...line])) {
        answerText.innerText = `Введите данные`;
    } else {
        const det = determinant([point, ...line]);
        const place = det > 0
            ? 'левее'
            : det < 0
                ? 'правее'
                : 'на';

        answerText.innerText = `Точка расположена ${place} прямой`;
        points.forEach((point, index) => {
            showPoint(canvas, ctx, point, `p${index}`);
        });
        showLine(canvas, ctx, [[xMin, getYfromEquationOfLine(line, xMin)],
            [xMax, getYfromEquationOfLine(line, xMax)]]);
    }
    answerPlace.appendChild(answerText);
}

function showAnswerForLineAndLine(points, answerPlace, canvas, ctx, xMin, xMax) {

    const [firstLine, secondLine] = [[points[0], points[1]],
        [points[2], points[3]]];
    const answerText = document.createElement('p');

    if (!!checkArrayIsZero([...firstLine, ...secondLine])) {
        answerText.innerText = `Введите данные`;
    } else {
        const determinants = [
            // начало первой прямой сравнивается со второй прямой
            determinant([...firstLine[0],
                ...secondLine[0],
                ...secondLine[1]]),
            // конец первой прямой сравнивается со второй прямой
            determinant([...firstLine[1],
                ...secondLine[0],
                ...secondLine[1]]),
            // // начало второй прямой сравнивается с первой прямой
            determinant([...secondLine[0], ...firstLine[0], ...firstLine[1]]),
            // // конец второй прямой сравнивается с первой прямой
            determinant([...secondLine[1], ...firstLine[0], ...firstLine[1]]),
        ];

        if (!!checkArrayIsZero(determinants)) {
            if ((((secondLine[0][0] <= firstLine[1][0]) && (secondLine[0][1] <= firstLine[1][1])) &&
                    ((secondLine[0][0] >= firstLine[0][0]) && (secondLine[0][1] >= firstLine[0][1]))) ||
                (((secondLine[1][0] <= firstLine[1][0]) && (secondLine[1][1] <= firstLine[1][1])) &&
                    ((secondLine[1][0] >= firstLine[0][0]) && (secondLine[1][1] >= firstLine[0][1])))) {
                answerText.innerText = 'Отрезки лежат на одной прямой и пересекаются';
            }
            if (((secondLine[0][0] > firstLine[1][0]) && (secondLine[0][1] > firstLine[1][1])) ||
                ((secondLine[1][0] < firstLine[0][0]) && (secondLine[1][1] < firstLine[0][1]))) {
                answerText.innerText = 'Отрезки лежат на одной прямой и не пересекаются';
            }
        } else {
            if (!!isIntersectLines(determinants)) {
                // получаем вектор прямой
                const p3p4 = getVector(points[2], points[3]);
                const p3p1 = getVector(points[2], points[0]);
                // n - вектор нормали для первой прямой
                const n = getVectorNormal(points[0], points[1]);

                // parametr=(p3p1*n)/(p3p4*n)
                const param = (getScalarProductVectors(p3p1, n) / getScalarProductVectors(p3p4, n)).toFixed(4);
                const pointIntersection = [Math.ceil(points[2][0] + p3p4[0] * param), Math.ceil(points[2][1] + p3p4[1] * param)];

                answerText.innerText = `Отрезки пересекаются в точке:  p(${pointIntersection[0]},${pointIntersection[1]}) `;
            } else {
                answerText.innerText = 'Отрезки не пересекаются';
            }

        }

        points.forEach((point, index) => {
            showPoint(canvas, ctx, point, `p${index}`);
        });
        [firstLine, secondLine].forEach(line => {
            showLine(canvas, ctx, line);
        });
    }
    answerPlace.appendChild(answerText);
}

function showAnswerForPointAndSimpleFigure(points, answerPlace, canvas, ctx, xMin) {
    // координаты точки
    const p0 = points[0];
    // точки для определения направления векторов граней против часовой стрелки
    const pointsForEdges = [...points.slice(1), points[1]].reverse();
    // получаем все грани по направлению против часовой стрелки
    const edges = [];
    pointsForEdges.forEach(
        (point, index, points) => {
            if (index !== points.length - 1)
                edges.push([point, points[index + 1]]);
        }
    );
    // получаем векторы граней
    const edgesVectorsCounterClockWiseDirection = edges.map(line => getVector(...line));
    // получаем векторные произведения всех пар граней
    const allVectorProductVectors = getAllVectorProductVectors(edgesVectorsCounterClockWiseDirection);
    // проверяем является ли фигура выпуклой (все векторные произведения должны быть одного знака),
    // от этого зависит алгоритм проверки
    const convexFigure = isConvexFigure(allVectorProductVectors);
    // если фигура не выпуклая,
    // определять положение точки будем при помощи лучевого теста
    // если луч пересек грани четное количество раз, значит точка лежит за пределами фигуры
    if (!convexFigure) {
        // рисуем луч для определения положения точки
        const tempRay = [[xMin, p0[1]], p0];
        showLine(canvas, ctx, tempRay);

    }

    console.log(convexFigure);
    points.forEach((point, index) => {
        showPoint(canvas, ctx, point, `p${index}`);
    });

    edges.forEach(edge => {
        showLine(canvas, ctx, edge);
    });
}

export {
    clearCanvas, clearAnswerPlace, openPage, closePage,
    createCoordsSystemOnCanvas, createContext, createCanvas,
    showAnswerForPointAndLine, showAnswerForLineAndLine, showAnswerForPointAndSimpleFigure,
    createCordsInput
};

