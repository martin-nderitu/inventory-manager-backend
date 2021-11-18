export default function itemExists<T, U>(response: T, id: U) {
    if (response && id) {
        // @ts-ignore
        return response.dataValues.id !== id;
    }
    return response !== null;
}