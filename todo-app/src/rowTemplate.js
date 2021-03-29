export function rowTemplate (todo){
    return `
    <td><input type ="checkbox" id="select" name="select" ${todo.checked}></td>
    <td><span id="text">${todo.text}</span></td>
    <td><input type="button" id="delete" value="delete"></td>
    <td>${todo.dateFormat}</td>`
  }

