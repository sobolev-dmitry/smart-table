import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    // @todo: #1.3 —  обработать события и вызвать onAction()

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            // Получаем клонированный шаблон строки
            const row = cloneTemplate(rowTemplate);
            
            // Перебираем ключи данных
            Object.keys(item).forEach(key => {
                // Проверяем, что key существует в row.elements
                if (row.elements[key]) {
                    // Присваиваем значение в textContent соответствующего элемента
                    row.elements[key].textContent = item[key];
                }
            });
            
            // Возвращаем контейнер строки для вставки в таблицу
            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}