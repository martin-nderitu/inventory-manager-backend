import isEmpty from "./isEmpty.js";

export default function toTitleCase(str: string) {
    str = str.trim();
    if (isEmpty(str)) {
        return str;
    }
    return str.toLowerCase().split(" ").map( word => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(" ");
}
