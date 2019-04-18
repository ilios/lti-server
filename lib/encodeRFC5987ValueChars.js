'use strict';

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Examples
const encodeRFC5987ValueChars = str => {
  return encodeURIComponent(str).
    replace(/['()]/g, escape). // i.e., %27 %28 %29
    replace(/\*/g, '%2A').
    replace(/%(?:7C|60|5E)/g, unescape);
};

module.exports = encodeRFC5987ValueChars;
