import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";  // ← Импорт модуля сортировки
import {initTable} from "./components/table.js";

// Исходные данные, используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    // Преобразуем строковые значения в числа
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения

    // Применяем пагинацию
    result = applyPagination(result, state, action);

    // Применяем сортировку
    result = applySorting(result, state, action);  // ← Применение сортировки

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header'],  // ← Добавляем шаблон заголовка с кнопками сортировки
    after: ['pagination']
}, render);

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,      // ← Кнопка сортировки по дате
    sampleTable.header.elements.sortByTotal     // ← Кнопка сортировки по сумме
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
