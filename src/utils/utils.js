
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