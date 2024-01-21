const pages = document.querySelector('.pages');
const closeBtn = document.querySelector('.close-page');


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
    console.log(event.target);
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



pages.addEventListener('click', () => openPage(event, closeBtn));
closeBtn.addEventListener('click', closePage);

