import {Info, Task, Instruction} from './info-functions.js';
import {GeometricalPad, stage, xAxis, yAxis, create_obj} from './geometrical_objects.js';
import { MainPad } from './algho_runner.js';
import { TablePad } from './tables.js';

/**
 * зумирование канваса при прокрутке колёсика
 * @param {konva-obj} stage сцена (основа канваса)
 * @param {konva-obj} xAxis ось х
 * @param {konva-obj} yAxis ось у
 */
function addWheel(stage, xAxis, yAxis) {
    const scaleBy = 1.05; //* @typedef number
    stage.on('wheel', (e) => {
        e.evt.preventDefault();

        var oldScale = stage.scaleX(); //* @typedef number

        var pointer = stage.getPointerPosition(); //* @typedef konva-object

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1; //* @typedef number

        if (e.evt.ctrlKey)
            direction = -direction;

        if (oldScale >= 5 && direction > 0)
            return;

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy; //* @typedef number

        stage.scale({
            x: newScale,
            y: newScale
        });
        xAxis.points()[0] = Math.min(-stage.width() / stage.scale().x, -stage.width());
        xAxis.points()[2] = Math.max(stage.width() / stage.scale().x, stage.width());
        yAxis.points()[1] = Math.min(-stage.height() / stage.scale().y, -stage.height());
        yAxis.points()[3] = Math.max(stage.height() / stage.scale().y, stage.height());

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    });
}


/**
 * ставит на кнопки действия
 * @param {function-pointer} указатель на функцию
 * @param {function-pointer} указатель на функцию
 * @param {function-pointer} указатель на функцию
 */
function addButton(Info, Task, Instruction) {
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);
    document.getElementById("submit").addEventListener("click", (function() {
        var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
        MainPad(obj, 4);        // fill figure 
    }));
    document.getElementById("clear").addEventListener("click", (function() {
        var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
        GeometricalPad(obj, 2); // clean layer
        MainPad(NaN, 3);        // clear dots
        TablePad(obj, 1);       // clear tables
    }));
    document.getElementById("add").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
        [obj.x, obj.y] = [parseFloat(el.x.value), parseFloat(el.y.value)];
        if (!obj.x || !obj.y)
            return;

        TablePad(obj, 2);       // add line to table
        MainPad(obj, 1);        // push cords to cords arr
        [obj.x, obj.y] = [parseFloat(el.x.value) + width / 2, height / 2 - parseFloat(el.y.value)];
        GeometricalPad(obj, 4); // add circle
        MainPad(obj, 2);        // draw line
    }));
}


/**
 * реакция на клик мышкой по полотну
 * @param {konva-object} stage сцена на которой полотно находится
 */
function addCircleToCanvas(stage){
    stage.addEventListener('click', function(e) {
        if (e.button != 0)
            return;
        var pointer = stage.getRelativePointerPosition();

        var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
        [obj.x, obj.y] = [pointer.x - width / 2, height / 2 - pointer.y]

        MainPad(obj, 5)         // предварительная очистка канвасе если до этого фигура уже была закрашена
        TablePad(obj, 2);       // add line to table
        MainPad(obj, 1);        // push cords to cords arr

        [obj.x, obj.y] = [pointer.x, pointer.y]
        GeometricalPad(obj, 4); // add circle
        MainPad(obj, 2);        // draw line
    });
}


/**
 * точка входа в модуль
 */
export function EventsPad(){
    addButton(Info, Task, Instruction);
    addWheel(stage, xAxis, yAxis);
    addCircleToCanvas(stage);
}