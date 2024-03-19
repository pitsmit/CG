import { addRowHandlers, GetCellValues, show_res_table, validation } from './tables.js';
import { stage, refresh_graph, groupCircles, ResGroup, layer, plot_results, update_graph, xAxis, yAxis } from './graphical_objects.js';
import { search_centeres, search_corners, search_min_angle, create_circles, make_float } from './math.js';
import { AddActions, AddButton } from './events.js';

addRowHandlers("multi1");
addRowHandlers("multi2");
stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
AddActions(stage, layer, groupCircles, ResGroup, xAxis, yAxis);
AddButton(Run, ResGroup, groupCircles);


/**
 * Основная функция программы, весь процесс от получения данных до построения окружностей
 */
function Run() {
    ResGroup.destroy();
    var table_arr_1 = GetCellValues('multi1');
    var table_arr_2 = GetCellValues('multi2');

    var tmp = [];
    for (var i = 0; i < table_arr_1.length; i++)
        tmp.push(table_arr_1[i]);
    for (var i = 0; i < table_arr_2.length; i++)
        tmp.push(table_arr_2[i]);

    if (validation(table_arr_1) == -1 || validation(table_arr_2) == -1 || validation(tmp) == -1){
        alert("Ошибка! В таблицы введены одинаковые точки! Проверьте правильность ввода.");
        return;
    }
    else if (validation(table_arr_1) == -3 || validation(table_arr_2) == -3){
        alert("Ошибка! В таблицы введены некорректные данные! Проверьте правильность ввода.");
        return;
    }

    make_float(table_arr_1);
    make_float(table_arr_2);

    groupCircles.destroy();
    update_graph(layer, table_arr_1, "red", groupCircles);
    update_graph(layer, table_arr_2, "green", groupCircles);

    if (table_arr_1.length < 3 || table_arr_2.length < 3){
        alert("Ошибка! В каждом множестве должно быть минимум по 3 точки!");
        return;
    }

    var circle_arr_1 = create_circles(table_arr_1);
    var circle_arr_2 = create_circles(table_arr_2);

    if (circle_arr_1.length == 0 || circle_arr_2.length == 0){
        alert("Ошибка! Похоже, что точки с такими координатами не позволяют провести окружностей");
        return;
    }

    var centres_1 = search_centeres(circle_arr_1);
    var centres_2 = search_centeres(circle_arr_2);

    var final_pairs_circles_with_corners = search_corners(centres_1, centres_2);
    var min_angle_arr_data = search_min_angle(final_pairs_circles_with_corners);

    plot_results(min_angle_arr_data);
    show_res_table(min_angle_arr_data);
}