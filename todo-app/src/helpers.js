function generateId() {
  return Math.floor(Date.now() * Math.random() * 10);
}

function transformDateFormat(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

function transformDate(todo) {
  return `${transformDateFormat(todo.date.getDate())}-${transformDateFormat(1 + todo.date.getMonth())}-${todo.date.getFullYear()}`;
}
export { transformDate, generateId };
