import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true); // берём первый элемент как шаблон
    pages.firstElementChild.remove(); // удаляем оригинал из контейнера

    return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;                  // количество строк на странице
        const pageCount = Math.ceil(data.length / rowsPerPage); // общее число страниц (округлено вверх)
        let page = state.page;                                 // текущая страница

        // @todo: #2.6 — обработать действия
        if (action) {
            switch (action.name) {
                case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
                case 'next': page = Math.min(pageCount, page + 1); break;  // переход на следующую страницу
                case 'first': page = 1; break;                             // переход на первую страницу
                case 'last': page = pageCount; break;                     // переход на последнюю страницу
            }
        }

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5); // получаем массив номеров страниц для отображения (максимум 5)
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);       // клонируем шаблон кнопки
                return createPage(el, pageNumber, pageNumber === page); // заполняем данными и возвращаем элемент
            })
        );

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1;            // с какой строки выводим
        toRow.textContent = Math.min((page * rowsPerPage), data.length); // до какой строки выводим (с учётом последней страницы)
        totalRows.textContent = data.length;                           // общее количество строк

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;            // сколько строк нужно пропустить
        return data.slice(skip, skip + rowsPerPage);    // получаем нужную часть строк
    }
}