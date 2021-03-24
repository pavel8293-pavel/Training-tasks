function generateId() {
  return Math.floor(Date.now() * Math.random() * 10);
}

function transformDateFormat(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}
export { transformDateFormat, generateId };
