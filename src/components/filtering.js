import { createComparison, defaultRules } from "../lib/compare.js";


export function initFiltering(elements, indexes, data) { // ← Добавляем параметр data
    // 1. Собираем уникальные имена продавцов из data
    const sellerValues = data
        .map(row => row.seller)
        .filter(Boolean) // Убираем пустые значения
        .sort();

    const uniqueSellers = [...new Set(sellerValues)];

    // 2. Заполняем <select data-name="searchBySeller">
    const sellerSelect = elements.searchBySeller;
    if (sellerSelect) {
        uniqueSellers.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            sellerSelect.appendChild(option);
        });
    }

    // 3. Создаём компаратор с правилом для seller
    const compare = createComparison(defaultRules, [
        (key, sourceValue, targetValue, source, target) => {
            if (key !== 'seller') return { continue: true };
            if (!target.seller || target.seller === '') return { skip: true };
            return { result: source.seller === target.seller };
        }
    ]);

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input[data-field]');
            if (input) {
                input.value = '';
                state[input.dataset.field] = '';
            }
        }

        return data.filter(row => compare(row, state));
    };
}