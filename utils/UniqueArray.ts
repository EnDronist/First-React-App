export default class UniqueArray<T> extends Array {
    // Fields
    private _counter: number = 0;
    /**
     * ID of next element to be added
     */
    get counter(): Readonly<number> { return this._counter }
    private _ids: Array<number> = [];
    /**
     * Array, containing a unique id to every element
     */
    get ids(): Readonly<Array<number>> { return this._ids }

    // Methods
    constructor(array?: Array<T> | UniqueArray<T>) {
        super();
        if (typeof(array) !== 'object') return;
        if (array.constructor.name == Array.name) {
            this._ids = Array.from(Array(array.length).keys());
            this._counter = super.push(...array);
        }
        else if (array.constructor.name == UniqueArray.name) {
            const uniqueArray = array as UniqueArray<T>;
            this._ids = uniqueArray._ids;
            this._counter = uniqueArray._counter;
            super.push(...uniqueArray);
        }
    }
    // Gets an array with numbers from 'start' to 'end'
    getRangeArray(start: number, end: number): Array<number> {
        var list: Array<number> = [];
        for (let i = start; i <= end; ++i) list.push(i);
        return list;
    }
    // Add & Remove
    splice(start: number, deleteCount: number, ...items: Array<T>): Array<T> {
        var items_ids: Array<number>;
        this._ids.splice(start, deleteCount,
            ...this.getRangeArray(this._counter, this._counter + items.length - 1));
        this._counter += items.length;
        return super.splice(start, deleteCount, ...items);
    }
    // Add
    add(index: number, object: T): void {
        if (index > this.length) index = this.length;
        this._ids.splice(index, 0, this._counter++);
        super.splice(index, 0, object);
    }
    push(...items: Array<T>): number {
        this._ids.push(...this.getRangeArray(this._counter, this._counter + items.length - 1));
        this._counter += items.length;
        return super.push(...items);
    }
    unshift(...items: Array<T>): number {
        this._ids.unshift(...this.getRangeArray(this._counter, this._counter + items.length - 1));
        this._counter += items.length;
        return super.unshift(...items);
    }
    // Remove
    remove(start: number, deleteCount: number = 1): Array<number> {
        this._ids.splice(start, deleteCount);
        return super.splice(start, deleteCount);
    }
    clear(): void {
        this._ids.splice(0, this._ids.length);
        super.splice(0, this.length);
    }
}