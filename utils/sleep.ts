export default async function(milliseconds: number) {
    await new Promise(resolve => { setTimeout(resolve, milliseconds) });
}