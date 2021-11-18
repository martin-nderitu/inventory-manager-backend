export default function isEmpty(value: undefined | null | object | string) {
    return value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0);
}
