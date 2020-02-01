import { Validation } from './types';

export default function validate<T extends Object>(value: T, validation: Validation<T>): boolean {
    if (typeof(value) != 'object') return false;
    let result: boolean = true;
    Object.keys(validation).map(key => {
        if (!validation[key](value[key])) result = false;
    });
    return result;
}