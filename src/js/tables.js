/**
 * проверка на случай повторного добавления той же точки в таблицу
 * @param {user-js-object} obj моя структура с нужными данными 
 * @returns код завершения функции
 */
function CheckIfAlsoInTable(obj) {
    var table = document.getElementById('tops'); //* @typedef table-object
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
 * @param {user-js-object} obj моя структура с нужными данными 
 */
function addline(obj) {
    if (CheckIfAlsoInTable(obj) != 0){
        alert("Ошибка! Такая точка уже есть в таблице!");
        return;
    }
    var table = document.getElementById('tops'); //* @typedef table-object
    var row = table.insertRow(table.rows.length); //* @typedef rows-object

    var cell1 = row.insertCell(0); //* @typedef cell-object
    var cell2 = row.insertCell(1); //* @typedef cell-object
    cell1.innerHTML = obj.x;
    cell2.innerHTML = obj.y;
    cell1.height = 20;
}


/**
 * очистка таблицы
 */
function ClearTable() {
  var table = document.getElementById('tops'); //* @typedef table-object
  var rows = table.getElementsByTagName("tr"); //* @typedef rows-object

  for (var i = rows.length - 1; i > 0; i--)
    table.rows[i].remove();
}


function addManyDots(obj){
    for (var i = 0; i < obj.arrofdots.length; i++){
        [obj.x, obj.y] = [obj.arrofdots[i][0], obj.arrofdots[i][1]];
        if (CheckIfAlsoInTable(obj) == 0)
            addline(obj);
    }
}


/**
 * 
 * @param {user-js-object} obj моя структура с нужными данными 
 * @param {*} FuncNumber номер функции для вызова
 */
export function TablePad(obj, FuncNumber){
    var arrfunc = [ClearTable, addline, addManyDots]; //* @typedef array of function-pointers

    arrfunc[FuncNumber - 1](obj);
}