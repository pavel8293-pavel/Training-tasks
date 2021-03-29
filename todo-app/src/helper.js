function generateId() {
  return Math.floor(Date.now() * Math.random() * 10);
}

function transformDateFormat(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

function createInput(node) {
  const editable = document.createElement('input')
  node.parentElement.append(editable)
  editable.type = 'text'
  editable.className = 'editable'
  editable.value = node.textContent
  editable.focus()
  return editable
}

export { transformDateFormat, generateId, createInput };
