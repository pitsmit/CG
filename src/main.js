import * as tables from './tables.js';
import { stage, create_obj_circle, create_obj_line, refresh_graph, groupCircles, ResGroup } from './graphical_objects.js';
import { search_centeres, search_corners, search_min_angle } from './math.js';
import { RunWithFile } from './file.js';
import { Info, Task, Instruction } from './info-functions.js';

const SUCCESS = 0;
const SAME_DOTS = -1;
const LOW_OR_EMPTY_TABLE = -2;
const BAD_SYMBOLS = -3;
const INVALID_DATA = -4;
const BAD_CIRCLES = -5;
const scaleBy = 1.05;

const width = window.innerWidth;
const height = window.innerHeight;

tables.addRowHandlers("multi1");
tables.addRowHandlers("multi2");

var layer = new Konva.Layer();
var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);
stage.add(layer);
refresh_graph(layer, xAxis, yAxis);


stage.addEventListener('click', function(e) {
    ResGroup.destroy();
    if (e.button != 0)
        return;
    var pointer = stage.getRelativePointerPosition();
    var circle = create_obj_circle(pointer.x, pointer.y, 5, 'red');
    layer.add(circle);
    groupCircles.add(circle);
    layer.add(groupCircles);
    tables.addline('multi1', pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4));
});


stage.addEventListener('contextmenu', function(e) {
    ResGroup.destroy();
    var pointer = stage.getRelativePointerPosition();
    var circle = create_obj_circle(pointer.x, pointer.y, 5, 'green');
    layer.add(circle);
    groupCircles.add(circle);
    layer.add(groupCircles);
    tables.addline('multi2', pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4));
});


stage.on('wheel', (e) => {
    e.evt.preventDefault();

    var oldScale = stage.scaleX();
    
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;

    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    if (oldScale >= 5 && direction > 0)
        return;

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });
    xAxis.points()[0] = Math.min(-stage.width() / stage.scale().x, -stage.width());
    xAxis.points()[2] = Math.max(stage.width() / stage.scale().x, stage.width());
    yAxis.points()[1] = Math.min(-stage.height() / stage.scale().y, -stage.height());
    yAxis.points()[3] = Math.max(stage.height() / stage.scale().y, stage.height());
    layer.add(xAxis);
    layer.add(yAxis);

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
});


function create_circles(arr) {
    var res = [];

    for (var i = 0; i < arr.length; i++){
        for (var j = i + 1; j < arr.length; j++){
            for (var k = j + 1; k < arr.length; k++){
                var p1x = arr[i][0];
                var p1y = arr[i][1];
                var p2x = arr[j][0];
                var p2y = arr[j][1];
                var p3x = arr[k][0];
                var p3y = arr[k][1];
                var circle = [[p1x, p1y], [p2x, p2y], [p3x, p3y]];
                
                if (p1x == p2x && p1x == p3x)
                    continue;
                else if (p1y == p2y && p1y == p3y)
                    continue;
                if (!((p3x - p1x) / (p2x - p1x) == (p3y - p1y) / (p2y - p1y)))
                    res.push(circle);
            }
        }
    }

    return res;
}


function make_float(arr) {
    for (var i = 0; i < arr.length; i++)
        for (var j = 0; j < arr[i].length; j++)
            arr[i][j] = parseFloat(arr[i][j]);
}


function validation(tab) {
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


function update_graph(layer, arr, color, groupCircles){
    for (var i = 0; i < arr.length; i++){
        var circle = create_obj_circle(arr[i][0] + width / 2, height / 2 - arr[i][1], 5, color);
        layer.add(circle);
        groupCircles.add(circle);
        layer.add(groupCircles);
    }
}


function Run() {
    ResGroup.destroy();
    var table_arr_1 = tables.GetCellValues('multi1');
    var table_arr_2 = tables.GetCellValues('multi2');

    var tmp = [];
    for (var i = 0; i < table_arr_1.length; i++)
        tmp.push(table_arr_1[i]);
    for (var i = 0; i < table_arr_2.length; i++)
        tmp.push(table_arr_2[i]);

    if (validation(table_arr_1) == SAME_DOTS || validation(table_arr_2) == SAME_DOTS || validation(tmp) == SAME_DOTS){
        alert("Ошибка! В таблицы введены одинаковые точки! Проверьте правильность ввода.");
        return SAME_DOTS;
    }
    else if (validation(table_arr_1) == BAD_SYMBOLS || validation(table_arr_2) == BAD_SYMBOLS){
        alert("Ошибка! В таблицы введены некорректные данные! Проверьте правильность ввода.");
        return INVALID_DATA;
    }

    make_float(table_arr_1);
    make_float(table_arr_2);

    groupCircles.destroy();
    update_graph(layer, table_arr_1, "red", groupCircles);
    update_graph(layer, table_arr_2, "green", groupCircles);

    if (table_arr_1.length < 3 || table_arr_2.length < 3){
        alert("Ошибка! В каждом множестве должно быть минимум по 3 точки!");
        return LOW_OR_EMPTY_TABLE;
    }

    var circle_arr_1 = create_circles(table_arr_1);
    var circle_arr_2 = create_circles(table_arr_2);

    if (circle_arr_1.length == 0 || circle_arr_2.length == 0){
        alert("Ошибка! Похоже, что точки с такими координатами не позволяют провести окружностей");
        return BAD_CIRCLES;
    }

    var centres_1 = search_centeres(circle_arr_1);
    var centres_2 = search_centeres(circle_arr_2);

    var final_pairs_circles_with_corners = search_corners(centres_1, centres_2);
    var min_angle_arr_data = search_min_angle(final_pairs_circles_with_corners);

    var ResCircle1 = create_obj_circle(min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], min_angle_arr_data[0][2], NaN, 'red', 2);
    var ResCircle2 = create_obj_circle(min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1], min_angle_arr_data[1][2], NaN, 'green', 2);
    var LineBetweenCentres = create_obj_line([min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], 
    min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1]], 'black', 3);
    var Centre1 = create_obj_circle(min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], 7, 'blue', NaN, NaN);
    var Centre2 = create_obj_circle(min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1], 7, 'blue', NaN, NaN);

    ResGroup.add(ResCircle1);
    ResGroup.add(ResCircle2);
    ResGroup.add(LineBetweenCentres);
    ResGroup.add(Centre1);
    ResGroup.add(Centre2);
    layer.add(ResGroup);

    tables.show_res_table(min_angle_arr_data);
}


function ClearAll() {
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


document.getElementById("addbutton1").addEventListener("click", function(){
    tables.addline('multi1', "", "");
}, false);
document.getElementById("addbutton2").addEventListener("click", function(){
    tables.addline('multi2', "", "");
}, false);
document.getElementById("runner").addEventListener("click", Run);

document.getElementById("clear-button").addEventListener("click", ClearAll);
document.getElementById("file-button").addEventListener("click", function(){
    RunWithFile('multi1', 'multi2');
}, false);

document.getElementById("info").addEventListener("click", Info);
document.getElementById("task").addEventListener("click", Task);
document.getElementById("instruction").addEventListener("click", Instruction);