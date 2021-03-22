export default class DOMelement {
  constructor(tagName = 'div', parent, className = '', id = '', status, inner = '') {
    let child = document.createElement(tagName);
    document.querySelectorAll(parent).forEach((node) => {
      node.append(child)
    })
    child.className = className;
    child.innerHTML = inner
    child.id = id
    if (status) {
      child.classList.add('selected')
    }
    child.children[0].children[0].checked = status
  }
}