import { ClearAll, addRowHandlers, GetCellValues, show_res_table, validation } from './tables.js';
import { stage, create_obj_circle, create_obj_line, refresh_graph, groupCircles, ResGroup, layer } from './graphical_objects.js';
import { search_centeres, search_corners, search_min_angle, create_circles } from './math.js';
import { RunWithFile } from './file.js';
import { Info, Task, Instruction } from './info-functions.js';
import { AddActions, AddButton } from './events.js';

export const SUCCESS = 0;
export const SAME_DOTS = -1;
export const LOW_OR_EMPTY_TABLE = -2;
export const BAD_SYMBOLS = -3;
export const INVALID_DATA = -4;
export const BAD_CIRCLES = -5;

addRowHandlers("multi1");
addRowHandlers("multi2");

var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);
stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
AddActions(stage, layer, groupCircles, ResGroup, xAxis, yAxis);


function make_float(arr) {
    for (var i = 0; i < arr.length; i++)
        for (var j = 0; j < arr[i].length; j++)
            arr[i][j] = parseFloat(arr[i][j]);
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
    var table_arr_1 = GetCellValues('multi1');
    var table_arr_2 = GetCellValues('multi2');

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

    show_res_table(min_angle_arr_data);
}


AddButton(RunWithFile, Info, Task, Instruction, Run, ClearAll, ResGroup, groupCircles);