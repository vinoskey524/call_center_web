/** Id generator */
export const generateIdFunc = (x?: { length: number }) => {
    const val = '0aW9zXe8CrVt1By5NuA46iZ3oEpRmTlYkUjIhOgPfMdQsSqDwFxGcHvJbKnL';
    const length = (x?.length !== undefined) ? x.length : val.length;
    let id = '';
    for (var i = 0; i < length; i++) id += val.charAt(Math.floor(Math.random() * 36));
    return id;
};