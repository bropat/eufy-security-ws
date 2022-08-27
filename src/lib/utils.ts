export const convertCamelCaseToSnakeCase = function (value: string): string {
    return value !== undefined ? value.replace(/[A-Z]/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : "_" + letter.toLowerCase();
    }) : "";
};