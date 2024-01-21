function clearCanvas(canvas, ctx) {
    ctx.clearRect(23, 0, canvas.clientWidth - 23, canvas.clientHeight - 23);
}

function clearAnswerPlace(place, tag) {
    tag.innerText = '';
    place.appendChild(tag);
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

function createCoordsSystemOnCanvas(canvas, ctx) {
    ctx.clearRect(23, 0, canvas.clientWidth, canvas.clientHeight);
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

function determinant(point, line) {
    let [pointX, pointY] = [...point];
    let [lineStartX, lineStartY] = [...line[0]];
    let [lineEndX, lineEndY] = [...line[1]];
    return (lineEndX - lineStartX) * (pointY - lineStartY) - (pointX - lineStartX) * (lineEndY - lineStartY);
}

function searchLocationPoint(point, line) {
    let det = determinant(point, line);
    let place = det > 0 ? 'левее' : det < 0 ? 'правее' : 'на';
    return `Точка расположена ${place} прямой`;
}

function openPage(event, btn, canvas, ctx) {
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
    createCoordsSystemOnCanvas(canvas, ctx);
}

function closePage(event) {
    event.preventDefault();
    event.stopPropagation();
    // скрытие кнопки закрытия окна
    this.classList.toggle('hide');
    // скрытие контента окна
    this.closest('div').querySelector('.full').firstElementChild.classList.toggle('hide');
    this.closest('div').querySelector('.full').lastElementChild.classList.toggle('hide');
    // возврат окна к первоначальному состоянию через удаление класса
    this.closest('div').querySelector('.full').classList.remove('full');
}

export {clearCanvas, clearAnswerPlace, showPoint, showLine, searchLocationPoint, openPage, closePage};

