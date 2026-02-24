import { rules, createComparison } from "../lib/compare.js";

// Инициализирует функцию поиска для таблицы по указанному полю ввода
export function initSearching(searchField) {
    // Создаёт функцию сравнения: пропускает строки с пустыми значениями и ищет по нескольким полям
    const compare = createComparison(
        ['skipEmptyTargetValues'], // опция: пропускать строки с пустыми целевыми значениями
        [
            rules.searchMultipleFields(
                searchField,           // поле с поисковым запросом
                ['date', 'customer', 'seller'], // поля для поиска
                false                   // поиск без учёта регистра
            )
        ]
    );

    // Возвращает функцию-фильтр: оставляет только строки, соответствующие поисковому запросу
    return (data, state, action) => {
        // Фильтрует данные — включает в результат только строки, для которых compare() возвращает true
        return data.filter(row => compare(row, state));
    };
}
