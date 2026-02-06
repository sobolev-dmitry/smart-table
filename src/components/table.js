import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    // Обрабатываем шаблоны "до" таблицы (в обратном порядке)
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // Обрабатываем шаблоны "после" таблицы (в исходном порядке)
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 — обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

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