// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Examples
export default (str: string) => {
    return encodeURIComponent(str)
        .replace(/['()]/g, escape) // i.e., %27 %28 %29
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, unescape);
};
