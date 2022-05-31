interface T {
    id: string;
}

export default function itemExists (response: T | null, id: string | undefined) {
    if (response && id) {
        return response.id !== id;
    }
    return response !== null;
}