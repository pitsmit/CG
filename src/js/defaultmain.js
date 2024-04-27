import {Info, Task, Instruction} from './info-functions.js';
import {create_obj} from './geometrical_objects.js';
import { MainPad } from './algho_runner.js';
import { TablePad } from './tables.js';
import { BrezCircle } from './base_algo.js';

/**
 * ставит на кнопки действия
 */
function addButton() {
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);

    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var obj = create_obj(); //* @typedef user-js-object(c-struct analog)

    document.getElementById("submit").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        obj.color = el.zatravka.value;
        obj.border_colour = el.edgecolor.value;
        obj.delay = parseFloat(el.delay.value);
        MainPad(obj, 4);        // fill figure 
    }));
    document.getElementById("clear").addEventListener("click", (function() {
        TablePad(obj, 1);       // clear tables
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        MainPad(obj, 3);
    }));
    document.getElementById("add").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        [obj.x, obj.y, obj.color] = [parseFloat(el.x.value), parseFloat(el.y.value), el.edgecolor.value];
        if ((!obj.x && obj.x != 0) || (!obj.y && obj.y != 0))
            return;

        MainPad(obj, 5);
        ctx.fillStyle = el.edgecolor.value; //* @typedef string
        ctx.fillRect(obj.x + width / 2, height / 2 - obj.y, 1, 1);
        TablePad(obj, 2);       // add line to table
        MainPad(obj, 1);        // add cords to data
        MainPad(obj, 2);        // plot edge if need
    }));
    document.getElementById("addzat").addEventListener("click", (function() {
        const canvas = document.getElementById('container');
        var ctx = canvas.getContext("2d");
        var el = document.getElementById('collect-data'); //* @typedef html-object
        MainPad(obj, 5);
        ctx.fillStyle = el.zatravka.value; //* @typedef string
        ctx.fillRect(parseFloat(el.xzat.value) + width / 2, height / 2 - parseFloat(el.yzat.value), 1, 1);
        [obj.x, obj.y] = [parseFloat(el.xzat.value), parseFloat(el.yzat.value)];
        MainPad(obj, 6);        // set zatravka pixel
    }));

    document.getElementById("plot-circle").addEventListener("click", (function() {
        MainPad(obj, 5);
        var el = document.getElementById('collect-data'); //* @typedef html-object
        BrezCircle(parseFloat(el.xcir.value), parseFloat(el.ycir.value), el.edgecolor.value, parseFloat(el.rcir.value));
    }));
}


/**
 * реакция на клик мышкой по полотну
 */
function addPixelToCanvas(){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var el = document.getElementById("collect-data"); //* @typedef html-object
    var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
    canvas.addEventListener("mousedown", function(e){
        MainPad(obj, 5);
        var x = e.offsetX;
        var y = e.offsetY;
        [obj.x, obj.y, obj.color] = [x - width / 2, height / 2 - y, el.edgecolor.value];
        TablePad(obj, 2);  

        ctx.fillStyle = el.edgecolor.value;       
        ctx.fillRect(x, y, 1, 1);

        MainPad(obj, 1);
        MainPad(obj, 2);
      });
}


function prepareCanvas(){
    const canvas = document.getElementById('container');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function addCurvesToCanvas(){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var el = document.getElementById("collect-data"); //* @typedef html-object
    var obj = create_obj();
    canvas.onmousedown = function(e){
        MainPad(obj, 5);
        canvas.onmousemove = function(e){
            var x = e.offsetX;
            var y = e.offsetY;

            ctx.fillStyle = el.edgecolor.value;       
            ctx.fillRect(x, y, 1, 1);
            obj.arrofdots.push([x - width / 2, height / 2 - y]);
        };
        canvas.onmouseup = function(e){
            canvas.onmousemove = null;
            TablePad(obj, 3); 
        }
    }
}


/**
 * точка входа в программу
 */
function EventsPad(){
    addButton();
    prepareCanvas();
    addPixelToCanvas();
    addCurvesToCanvas();
}


EventsPad();            // add events on all buttons and another