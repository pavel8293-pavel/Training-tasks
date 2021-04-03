import { transformDateFormat } from './helper.js';

export function rowTemplate(todo) {
  return `
    <tr class="table-item" id =${todo.id}>
    <td><input type ="checkbox"  name="select" ${todo.checked && 'checked'}></td>
    <td><span>${todo.text}</span></td>
    <td><input type="button" value="delete" name="delete"></td>
    <td>${transformDateFormat(new Date(todo.date).getDate())}-${transformDateFormat(1 + new Date(todo.date).getMonth())}-${new Date(todo.date).getFullYear()}</td>
  </tr>`;
}
