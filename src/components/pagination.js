import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true); // берём первый элемент как шаблон
    pages.firstElementChild.remove(); // удаляем оригинал из контейнера

    let pageCount; // временная переменная для хранения количества страниц при последней отрисовке

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // @todo: #2.6 — обработать действия
        if (action) {
            switch (action.name) {
                case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
                case 'next': page = Math.min(pageCount || 1, page + 1); break;  // переход на следующую страницу
                case 'first': page = 1; break;                             // переход на первую страницу
                case 'last': page = pageCount || 1; break;             // переход на последнюю страницу
            }
        }

        return Object.assign({}, query, { // добавим параметры к query, но не изменяем исходный объект
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5); // получаем массив номеров страниц для отображения (максимум 5)
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);       // клонируем шаблон кнопки
                return createPage(el, pageNumber, pageNumber === page); // заполняем данными и возвращаем элемент
            })
        );

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * limit + 1;            // с какой строки выводим
        toRow.textContent = Math.min((page * limit), total); // до какой строки выводим (с учётом последней страницы)
        totalRows.textContent = total;                           // общее количество строк
    };

    return {
        updatePagination,
        applyPagination
    };
};
