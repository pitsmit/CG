/**
 * проверка на случай повторного добавления той же точки в таблицу
 * @param {user-js-object} obj моя структура с нужными данными 
 * @returns код завершения функции
 */
function CheckIfAlsoInTable(obj) {
  var table = document.getElementById("multi1"); //* @typedef table-object
  if (table.rows.length == 1)
      return 0;
  for (var r = 1; r < table.rows.length; r++){
      var x = parseFloat(table.rows[r].cells[0].innerHTML); //* @typedef number
      var y = parseFloat(table.rows[r].cells[1].innerHTML); //* @typedef number
      if (x == obj.x && y == obj.y)
          return -1;
  }
  table = document.getElementById("multi2"); //* @typedef table-object
  if (table.rows.length == 1)
      return 0;
  for (var r = 1; r < table.rows.length; r++){
      var x = parseFloat(table.rows[r].cells[0].innerHTML); //* @typedef number
      var y = parseFloat(table.rows[r].cells[1].innerHTML); //* @typedef number
      if (x == obj.x && y == obj.y)
          return -1;
  }

  return 0;
}


/**
 * добавление строки в таблицу
 */
export function addline(obj) {
    if (CheckIfAlsoInTable(obj) != 0){
      alert("Ошибка! Такая точка уже есть в таблице!");
      return;
    }
    var table = document.getElementById(obj.tableId);
    var totalRowCount = table.rows.length; 
    var row = table.insertRow(totalRowCount);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = obj.x;
    cell2.innerHTML = obj.y;
    cell1.height = 20;
}


function GetCellValues(obj) {
    var arr = [];

    var table = document.getElementById(obj.tableId);
    for (var r = 1; r < table.rows.length; r++)
        arr.push([parseFloat(table.rows[r].cells[0].innerHTML), parseFloat(table.rows[r].cells[1].innerHTML)])

    return arr;
}


function ShowResTable(obj){
    var table = document.getElementById('ResTable');

    table.rows[1].cells[1].innerHTML = obj.data[0][2].toFixed(4);
    table.rows[2].cells[1].innerHTML = obj.data[1][2].toFixed(4);

    table.rows[1].cells[2].innerHTML = String(obj.data[0][0].toFixed(4)) + "        " + String(obj.data[0][1].toFixed(4));
    table.rows[2].cells[2].innerHTML = String(obj.data[1][0].toFixed(4)) + "        " + String(obj.data[1][1].toFixed(4));
}


function ClearAll() {
  var table = document.getElementById('multi1');
  var rows = table.getElementsByTagName("tr");
  var lg = rows.length;
  for (var i = 1; i < lg; i++) {
    var currentRow = table.rows[1];
    currentRow.remove();
  }

  var table = document.getElementById('multi2');
  var rows = table.getElementsByTagName("tr");
  lg = rows.length;
  for (var i = 1; i < lg; i++) {
    var currentRow = table.rows[1];
    currentRow.remove();
  }

  var table = document.getElementById('ResTable');
  table.rows[1].cells[1].innerHTML = "";
  table.rows[1].cells[2].innerHTML = "";
  table.rows[2].cells[1].innerHTML = "";
  table.rows[2].cells[2].innerHTML = "";
}


/**
 * 
 * @param {user-js-object} obj моя структура с нужными данными 
 * @param {*} FuncNumber номер функции для вызова
 */
export function TablePad(obj, FuncNumber){
  var arrfunc = [ClearAll, addline, ShowResTable, GetCellValues]; //* @typedef array of function-pointers

  return arrfunc[FuncNumber - 1](obj);
}