const escapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
  '`': '&#x60;',
};

const escapedRegExp = /[&<>"'`]/g;

function escapeHtmlChar(chr) {
  return escapes[chr];
}

function replaceEscapedChar(string) {
  return (string && escapedRegExp.test(string))
    ? string.replace(escapedRegExp, escapeHtmlChar)
    : string;
}

export { replaceEscapedChar };
