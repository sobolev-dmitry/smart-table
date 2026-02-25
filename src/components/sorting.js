import { sortMap } from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // Запоминаем выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // переключаем состояние по карте
            field = action.dataset.field;                         // поле для сортировки из датасета кнопки
            order = action.dataset.value;                          // направление из обновлённого датасета

            // Сбрасываем сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) { // если это не нажатая кнопка
                    column.dataset.value = 'none'; // сбрасываем в начальное состояние
                }
            });

        } else {
            // Получаем выбранный режим сортировки
            columns.forEach(column => {                        // перебираем все кнопки сортировки
                if (column.dataset.value !== 'none') {        // ищем ту, что не в начальном состоянии
                    field = column.dataset.field;               // сохраняем поле сортировки
                    order = column.dataset.value;              // сохраняем направление сортировки
                }
            });
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    };
}
