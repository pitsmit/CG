import { BAD_SYMBOLS, SAME_DOTS, SUCCESS } from "./main.js";

export function addRowHandlers(tab) {
    var table = document.getElementById(tab);
    var rows = table.getElementsByTagName("tr");
    for (var i = 1; i < rows.length; i++) {
      var currentRow = table.rows[i];

      var createClickHandler1 = function(row) {
        return function() {
          row.remove();
        };
      };

      currentRow.ondblclick = createClickHandler1(currentRow);
    }
}


/**
 * добавление строки в таблицу
 * @param {id таблицы} tab 
 * @param {значение первой ячейки} x 
 * @param {значение второй ячейки} y 
 */
export function addline(tab, x, y) {
    var table = document.getElementById(tab);
    var totalRowCount = table.rows.length; 
    var row = table.insertRow(totalRowCount);
    addRowHandlers(tab);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = x;
    cell2.innerHTML = y;
    cell1.height = 20;
}


export function GetCellValues(tab) {
    var arr = [];

    var table = document.getElementById(tab);
    for (var r = 1; r < table.rows.length; r++)
        arr.push([table.rows[r].cells[0].innerHTML, table.rows[r].cells[1].innerHTML])

    return arr;
}


export function show_res_table(data){
    var table = document.getElementById('ResTable');

    table.rows[1].cells[1].innerHTML = data[0][2].toFixed(4);
    table.rows[2].cells[1].innerHTML = data[1][2].toFixed(4);

    table.rows[1].cells[2].innerHTML = String(data[0][0].toFixed(4)) + "        " + String(data[0][1].toFixed(4));
    table.rows[2].cells[2].innerHTML = String(data[1][0].toFixed(4)) + "        " + String(data[1][1].toFixed(4));
}


export function validation(tab) {
  var reg = /^[-+]?\d*\.?\d+$/;

  for (var i = 0; i < tab.length; i++){
      for (var j = 0; j < tab[i].length; j++){
          if (reg.test(tab[i][j]) != true)
              return BAD_SYMBOLS;
      }
  }

  for (var i = 0; i < tab.length; i++){
      for (var j = i + 1; j < tab.length; j++){
          if (tab[i][0] == tab[j][0] && tab[i][1] == tab[j][1])
              return SAME_DOTS;
      }
  }

  return SUCCESS;
}


export function ClearAll(ResGroup, groupCircles) {
  ResGroup.destroy();
  groupCircles.destroy();

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