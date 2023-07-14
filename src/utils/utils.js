
// Function to save an object to file, given the object and fileName
export const saveObjectAsFile = (object, fileName) => {
    const json = JSON.stringify(object);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
};

// Defining the calculateEnclosedArea function
// Shoelace formula: https://en.wikipedia.org/wiki/Shoelace_formula
export const calculateEnclosedArea = (points) => {

    const n = points.length;
    let area = 0;

    for (let i = 0; i < n; i++) {
        const current = points[i];
        const next = points[(i + 1) % n];
        area += current.x * next.y - current.y * next.x;
    }

    area = Math.abs(area) / 2;
    return area;
};