export default function<T>(iterator: IterableIterator<[string, string]>): T {
    var result = {};
    var iteratorResult: IteratorResult<[string, string], [string, string]>;
    while (!(iteratorResult = iterator.next()).done)
        result[iteratorResult.value[0]] = isNaN(+iteratorResult.value[1])
            ? iteratorResult.value[1]
            : +iteratorResult.value[1];
    return result as T;
}