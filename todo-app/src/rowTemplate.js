import { transformDate } from './helpers.js';
import { replaceEscapedChar } from './inputEscaper.js';

export function rowTemplate(todo) {
  return `
    <tr class="table-item" id=${todo.id}>
    <td><input type="checkbox" name="select" ${todo.checked && 'checked'}></td>
    <td><span>${replaceEscapedChar(todo.text)}</span></td>
    <td><input type="button" value="delete" name="delete"></td>
    <td>${transformDate(todo)}</td>
  </tr>`;
}
