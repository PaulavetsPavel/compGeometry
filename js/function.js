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

function showPoint(canvas, ctx, point, name) {
    let [pointX, pointY] = [...point];
    ctx.beginPath();
    ctx.moveTo(pointX * 10 + 21, canvas.clientHeight - 21 - pointY * 10);
    ctx.arc(pointX * 10 + 21, canvas.clientHeight - 21 - pointY * 10, 2, 0, Math.PI * 2,);
    ctx.fill();
    ctx.fillText(name, pointX * 10 + 15, canvas.clientHeight - 30 - pointY * 10);

}

function showLine(canvas, ctx, line) {
    let [lineStartX, lineStartY] = [...line[0]];
    let [lineEndX, lineEndY] = [...line[1]];

    ctx.beginPath();
    ctx.moveTo(lineStartX * 10 + 21, canvas.clientHeight - 21 - lineStartY * 10);
    ctx.lineTo(lineEndX * 10 + 21, canvas.clientHeight - 21 - lineEndY * 10);
    ctx.stroke();
}

function determinant(point, line) {
    let [pointX, pointY] = [...point];
    let [lineStartX, lineStartY] = [...line[0]];
    let [lineEndX, lineEndY] = [...line[1]];

    return (lineEndX - lineStartX) * (pointY - lineStartY) - (pointX - lineStartX) * (lineEndY - lineStartY);
}

function getYfromEquationOfLine(line, x) {
    const [x1, y1] = [...line[0]];
    const [x2, y2] = [...line[1]];

    return (x - x1) * (y2 - y1) / (x2 - x1) + y1;
}

function checkArrayIsNull(arrs) {
        return arrs.every(arr => arr.every(el => el === 0));
}


function showAnswerForPointAndLine(form, answerPlace, canvas, ctx, xMin, xMax) {
    const point = [+form.pointX.value, +form.pointY.value];
    const line = [
        [+form.lineStartX.value, +form.lineStartY.value],
        [+form.lineEndX.value, +form.lineEndY.value]];
    const answerText = document.createElement('p');

// проверка введенных данных (массив одноуровневых массивов)
    if (!!checkArrayIsNull([point, ...line])) {
        answerText.innerText = `Введите данные`;
    } else {
        const det = determinant(point, line);
        const place = det > 0 ? 'левее' : det < 0 ? 'правее' : 'на';
        answerText.innerText = `Точка расположена ${place} прямой`;
        showPoint(canvas, ctx, point, 'p0');
        showPoint(canvas, ctx, line[0], 'p1');
        showPoint(canvas, ctx, line[1], 'p2');

        showLine(canvas, ctx, [[xMin, getYfromEquationOfLine(line, xMin)], [xMax, getYfromEquationOfLine(line, xMax)]]);
    }
    answerPlace.appendChild(answerText);
}

function showAnswerForLineAndLine(form, answerPlace, canvas, ctx, xMin, xMax) {
    const firstLine = [
        [+form.firstLineStartX.value, +form.firstLineStartY.value],
        [+form.firstLineEndX.value, +form.firstLineEndY.value]];
    const secondLine = [
        [+form.secondLineStartX.value, +form.secondLineStartY.value],
        [+form.secondLineEndX.value, +form.secondLineEndY.value]];

    const answerText = document.createElement('p');

    if (!!checkArrayIsNull([...firstLine, ...secondLine])) {
        answerText.innerText = `Введите данные`;
    } else {
        // начало первой прямой сравнивается со второй прямой
        const det1 = determinant(firstLine[0], secondLine);
        // конец первой прямой сравнивается со второй прямой
        const det2 = determinant(firstLine[1], secondLine);
        // начало второй прямой сравнивается с первой прямой
        const det3 = determinant(secondLine[0], firstLine);
        // конец второй прямой сравнивается с первой прямой
        const det4 = determinant(secondLine[1], firstLine);

        if (det1 === 0 && det2 === 0 && det3 === 0 && det4 === 0) {
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
            answerText.innerText = (det1 * det2 <= 0) && (det3 * det4 <= 0) ?
                'Отрезки пересекаются' : 'Отрезки не пересекаются';
        }


        showPoint(canvas, ctx, firstLine[0], 'p1');
        showPoint(canvas, ctx, firstLine[1], 'p2');
        showPoint(canvas, ctx, secondLine[0], 'p3');
        showPoint(canvas, ctx, secondLine[1], 'p4');
        showLine(canvas, ctx, firstLine);
        showLine(canvas, ctx, secondLine);
    }
    answerPlace.appendChild(answerText);
}

export {
    clearCanvas, clearAnswerPlace, openPage, closePage,
    createCoordsSystemOnCanvas, createContext, createCanvas,
    showAnswerForPointAndLine, showAnswerForLineAndLine
};

