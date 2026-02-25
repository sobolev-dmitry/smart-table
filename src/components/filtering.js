export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }));
        });
    };

    const applyFiltering = (query, state, action) => {
        // Обработка очистки поля при действии 'clear'
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input[data-field]');
            if (input) {
                input.value = '';
                state[input.dataset.field] = '';
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    // Ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                    // Чтобы сформировать в query вложенный объект фильтра
                }
            }
        });

        // Если в фильтре что‑то добавилось, применим к запросу
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}
