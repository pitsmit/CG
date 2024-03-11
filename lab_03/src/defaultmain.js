import { addWheel, addButton } from './events.js';
import { layer, stage, xAxis, yAxis, refresh_graph } from './geometrical_objects.js';
import { Info, Task, Instruction } from './info-functions.js';
import { LibraryFunction, CDA, BrezReal, BrezInt, BrezNoSteps, BY } from './algho_runner.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton(Info, Task, Instruction);


/**
 * получение данных от пользователя
 * @param {string} form id формочки 
 * @returns x, y начала и конца отрезка, цвет отрезка и заднего фона, алгоритм
 */
function GetUserData(form){
    var el = document.getElementById(form);
    var xn = parseFloat(el.xn.value);
    var yn = parseFloat(el.yn.value);
    var xk = parseFloat(el.xk.value);
    var yk = parseFloat(el.yk.value);
    var color = el.favcolor.value;
    var backcolor = el.back.value;
    var options = document.getElementsByName('state');
    var option_value;
    for(var i = 0; i < options.length; i++){
        if(options[i].checked){
            option_value = options[i].value;
            break;
        }
    }

    return [xn, yn, xk, yk, color, option_value, backcolor];
}


/**
 * запускает алгоритм построения отрезка в зависимости от того что в формочке
 * @param {string} form id формочки
 */
function SwitchAlghorithm(form){
    var [xn, yn, xk, yk, color, option_value, backgroudcolor] = GetUserData(form)
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backgroudcolor;

    switch(option_value){
        case "library-function":
            LibraryFunction(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "CDA":
            CDA(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezReal":
            BrezReal(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezInt":
            BrezInt(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezNoSteps":
            BrezNoSteps(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BY":
            BY(xn, yn, xk, yk, color, layer, width, height);
            break;
    }
}


document.getElementById('collect-data-for-line').addEventListener("submit", function(){
    SwitchAlghorithm('collect-data-for-line');
});