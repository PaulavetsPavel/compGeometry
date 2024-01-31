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

// определитель матрицы 2*2
function determinant(points) {
    let [pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY] = [...points.flat(2)];
       return (lineEndX - lineStartX) * (pointY - lineStartY) - (pointX - lineStartX) * (lineEndY - lineStartY);
}

// определение уравнения прямой по 2-м точкам и нахождение y при заданном x
function getYfromEquationOfLine(line, x) {
    const [x1, y1] = [...line[0]];
    const [x2, y2] = [...line[1]];

    return (x - x1) * (y2 - y1) / (x2 - x1) + y1;
}

// проверка массива на все нули
function checkArrayIsZero(array) {

    return array.flat().every(el => el === 0);
}

// проверки линий на пересечение
function isIntersectLines(firstLine, secondLine) {
    // массив определителей для матриц координат точки и прямой
    const determinants = [
        // начало первой прямой сравнивается со второй прямой
        determinant([...firstLine[0], ...secondLine[0], ...secondLine[1]]),
        // конец первой прямой сравнивается со второй прямой
        determinant([...firstLine[1], ...secondLine[0], ...secondLine[1]]),
        // // начало второй прямой сравнивается с первой прямой
        determinant([...secondLine[0], ...firstLine[0], ...firstLine[1]]),
        // // конец второй прямой сравнивается с первой прямой
        determinant([...secondLine[1], ...firstLine[0], ...firstLine[1]]),
    ];
    if (!!checkArrayIsZero(determinants)) {
        // если все определители равны 0, то отрезки лежат на одной прямой
        return 'inLine';
    } else if ((determinants[0] * determinants[1] <= 0) && (determinants[2] * determinants[3] <= 0)) {
        return 'intersect';
    } else {
        return 'notIntersect';
    }
}

// полечение вектора по точкам
function getVector(pointStart, pointEnd) {
    return [pointEnd[0] - pointStart[0],
        pointEnd[1] - pointStart[1]];

}

// вектор нормали
function getVectorNormal(pointStart, pointEnd) {
    return [pointStart[1] - pointEnd[1],
        pointEnd[0] - pointStart[0]];
}

// скалярное произведение векторов в координатах
function getScalarProductVectors(pointStart, pointEnd) {
    return (pointStart[0] * pointEnd[0]) + (pointStart[1] * pointEnd[1]);
}

// векторное произведение векторов в координатах
function getVectorProductVectors(vectorFirst, vectorSecond) {
    return (vectorFirst[0] * vectorSecond[1]) - (vectorFirst[1] * vectorSecond[0]);
}

// проверка фигуры на выпуклость
function isConvexFigure(productVectors) {
    return productVectors.every(el => el > 0) || productVectors.every(el => el < 0);
}


export {
    clearCanvas, clearAnswerPlace, openPage, closePage, determinant,
    createCoordsSystemOnCanvas, createContext, createCanvas,
    createCordsInput, showPoint, showLine, getYfromEquationOfLine,
    checkArrayIsZero, isIntersectLines, getVector, getVectorNormal,
    getScalarProductVectors, getVectorProductVectors, isConvexFigure,

};

