const escapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'
};

const reEscape = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"'
}

const escapedRegExp = /[&<>"'`]/g;
const reEscapedRegExp = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;

function replaceEscapedChar(string) {
    return (string && escapedRegExp.test(string))
        ? string.replace(escapedRegExp, escapeHtmlChar)
        : string;
};

function replaceReEscapedChar(string) {
    return (string && reEscapedRegExp.test(string))
        ? string.replace(reEscapedRegExp, reEscapeHtmlChar)
        : string;
};

function escapeHtmlChar(chr) {
    return escapes[chr];
};

function reEscapeHtmlChar(chr) {
    return reEscape[chr];
};

export {replaceEscapedChar,replaceReEscapedChar} 
