import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initTable } from "./components/table.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные, используемые в render()
const api = initData(sourceData); // присваиваем результат initData константе api


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
async function render(action) { // делаем функцию render асинхронной
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса

    // Применяем поиск
    query = applySearching(query, state, action); // обновляем query параметрами поиска

    query = applyFiltering(query, state, action); // обновляем query параметрами фильтрации
    
    query = applyPagination(query, state, action); // обновляем query параметрами пагинации

    // Применяем сортировку
    // result = applySorting(result, state, action);

    // Получаем данные с API
    const { total, items } = await api.getRecords(query);

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items); // передаём items вместо result
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация пагинации
const {applyPagination, updatePagination} = initPagination(
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
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация фильтрации
const {applyFiltering, updateIndexes} = initFiltering(
    sampleTable.filter.elements
);

// Инициализация поиска
const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Объявляем асинхронную функцию init()
async function init() {
    const indexes = await api.getIndexes(); // получаем индексы

    // Обновляем индексы в фильтрах
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

// вызов init render
init().then(render);
