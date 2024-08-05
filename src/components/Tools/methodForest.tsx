import $ from 'jquery';

/** Id generator */
export const generateIdFunc = (x?: { length: number }) => {
    const val = '0aW9zXe8CrVt1By5NuA46iZ3oEpRmTlYkUjIhOgPfMdQsSqDwFxGcHvJbKnL';
    const length = (x?.length !== undefined) ? x.length : val.length;
    let id = '';
    for (var i = 0; i < length; i++) id += val.charAt(Math.floor(Math.random() * 36));
    return id;
};

/** Animate modal */
export const animateModalFunc = (x: { scaffold: string, container: string, show: boolean }) => {
    const scaffold = x.scaffold;
    const container = x.container;
    const show = x.show;
    if (show) {
        const d = 100;
        $(`${scaffold}`).animate({ 'opacity': 1 }, d);
        $(`${container}`).animate({}, d);
        $(`${container}`).animate({ 'scale': 1 }, d);
        $(`${scaffold}`).css({ 'top': 0 });
    } else {
        const d = 90;
        $(`${container}`).css({ 'scale': 1.00001 });
        $(`${container}`).animate({}, d);
        $(`${container}`).animate({ 'scale': 0.85 }, d);
        $(`${scaffold}`).animate({}, d);
        $(`${scaffold}`).animate({ 'opacity': 0 }, d, () => {
            $(`${scaffold}`).css({ 'top': '100vh' });
            $(`${container}`).css({ 'scale': 1.3 });
        });
    }
};