// Инициализирует функцию поиска для таблицы по указанному полю ввода
export function initSearching(searchField) {
    return (query, state, action) => {
        return state[searchField]
            ? Object.assign({}, query, {
                search: state[searchField] // устанавливаем в query параметр поиска
            })
            : query; // если поле с поиском пустое, просто возвращаем query без изменений
    };
}
