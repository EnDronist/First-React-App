import { Validation } from './types';

export default function validate<T>(value: T, validation: Validation<T>): boolean {
    var result = true;
    Object.keys(value).map(key => {
        if (!validation[key](value[key])) result = false;
    });
    return result;
}