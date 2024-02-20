export const getShortDescription = (text: string | undefined) => {
    if (text && text.length > 100) {
        return text.substring(0, 97) + '...';
    } else {
        return text;
    }
}
