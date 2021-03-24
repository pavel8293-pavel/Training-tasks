export default class DOMelement {
  constructor(tagName = 'div', parent, className = '', inner = '', id = '', status) {
    const child = document.createElement(tagName);
    child.className = className;
    if (typeof parent === 'string') {
      document.querySelectorAll(parent).forEach((node) => {
        node.append(child);
      });
    } else {
      parent.append(child);
    }
    if (tagName === 'input') {
      child.value = inner;
      child.focus();
    } else {
      child.innerHTML = inner;
    }
    if (id) child.id = id;
    if (status) {
      child.classList.add('selected');
      child.children[0].children[0].checked = status;
    }
  }
}
