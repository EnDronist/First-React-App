// Gets an array with numbers from 'start' to 'end'
export default function(start: number, end: number): Array<number> {
    var list: Array<number> = [];
    for (let i = start; i <= end; ++i) list.push(i);
    return list;
}