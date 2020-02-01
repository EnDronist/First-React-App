export function fromUrlParams<T>(): T {
    var iterator = new URLSearchParams(window.location.search).entries();
    var result = {};
    var iteratorResult: IteratorResult<[string, string], [string, string]>;
    while (!(iteratorResult = iterator.next()).done)
        result[iteratorResult.value[0]] = isNaN(+iteratorResult.value[1])
            ? iteratorResult.value[1]
            : +iteratorResult.value[1];
    return result as T;
}
export function toUrlParams(object: Object): string {
    return '?' + Object.entries(object).map(
        ([key, value]) => `${key}=${value}`
    ).join('&');
}
export function mergeUrlParams(object: Object): string {
    return toUrlParams(Object.assign(fromUrlParams(), object));
}