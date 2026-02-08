import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // переключаем состояние по карте
            field = action.dataset.field;                         // поле для сортировки из датасета кнопки
            order = action.dataset.value;                          // направление из обновлённого датасета

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) { // если это не нажатая кнопка
                    column.dataset.value = 'none'; // сбрасываем в начальное состояние
                }
            });

        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {                        // перебираем все кнопки сортировки
                if (column.dataset.value !== 'none') {        // ищем ту, что не в начальном состоянии
                    field = column.dataset.field;               // сохраняем поле сортировки
                    order = column.dataset.value;              // сохраняем направление сортировки
                }
            });
        }

        return sortCollection(data, field, order);
    }
}