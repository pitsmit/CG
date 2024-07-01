import { TablePad } from './tables.js';
import { groupCircles, ResGroup, update_graph, GeometricalPad } from './graphical_objects.js';
import { search_centeres, search_corners, search_min_angle, create_circles } from './math.js';
import { AddActions, AddButton } from './events.js';

var obj = GeometricalPad(NaN, 1);
GeometricalPad(obj, 3);
GeometricalPad(obj, 2);
AddActions(groupCircles, ResGroup);
AddButton(Run, ResGroup, groupCircles);


/**
 * Основная функция программы, весь процесс от получения данных до построения окружностей
 */
function Run() {
    ResGroup.destroy();
    obj.tableId = 'multi1'
    var table_arr_1 = TablePad(obj, 4);
    obj.tableId = 'multi2'
    var table_arr_2 = TablePad(obj, 4);

    groupCircles.destroy();
    update_graph(table_arr_1, "red");
    update_graph(table_arr_2, "green");

    if (table_arr_1.length < 3 || table_arr_2.length < 3){
        alert("Ошибка! В каждом множестве должно быть минимум по 3 точки!");
        return;
    }

    var circle_arr_1 = create_circles(table_arr_1);
    var circle_arr_2 = create_circles(table_arr_2);

    if (circle_arr_1.length == 0 || circle_arr_2.length == 0){
        alert("Ошибка! Похоже, что точки с такими координатами не позволяют провести окружности");
        return;
    }

    var centres_1 = search_centeres(circle_arr_1);
    var centres_2 = search_centeres(circle_arr_2);

    var final_pairs_circles_with_corners = search_corners(centres_1, centres_2);
    var min_angle_arr_data = search_min_angle(final_pairs_circles_with_corners);

    obj.data = min_angle_arr_data;
    GeometricalPad(obj, 4);
    TablePad(obj, 3)
}