import { MainPad } from './algho_runner.js';
import { BrezCircle } from './base_algo.js';

/**
 * создание универсальной структуры для передачи нужных данных туда сюда
 * @returns структура(объект js)
 */
function create_obj(){return {x: 0, y: 0, color: "", delay: 0, arrofdots : [], border_colour: ""};}


/**
 * ставит на кнопки действия
 */
function addButton() {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        MainPad(obj, 3);
    }));
    document.getElementById("add").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        [obj.x, obj.y, obj.color] = [parseFloat(el.x.value) + width / 2, height / 2 - parseFloat(el.y.value), el.edgecolor.value];
        if ((!obj.x && obj.x != 0) || (!obj.y && obj.y != 0))
            return;

        MainPad(obj, 5);
        ctx.fillStyle = el.edgecolor.value; //* @typedef string
        ctx.fillRect(obj.x, obj.y, 1, 1);
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
        [obj.x, obj.y] = [parseFloat(el.xzat.value) + width / 2, height / 2 - parseFloat(el.yzat.value)];
        MainPad(obj, 6);        // set zatravka pixel
    }));

    document.getElementById("plot-circle").addEventListener("click", (function() {
        MainPad(obj, 5);
        var el = document.getElementById('collect-data'); //* @typedef html-object
        BrezCircle(parseFloat(el.xcir.value) + width / 2, height / 2 - parseFloat(el.ycir.value), el.edgecolor.value, parseFloat(el.rcir.value));
    }));
}


function convertToCanvas(canvas, x, y) {
	const canvasElement  = canvas.getBoundingClientRect();
    return [(x- canvasElement.left)*(canvas.width  / canvasElement.width), (y - canvasElement.top)*(canvas.height / canvasElement.height)];
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

        var [x, y] = convertToCanvas(canvas, e.clientX, e.clientY);
        [obj.x, obj.y, obj.color] = [x, y, el.edgecolor.value];

        ctx.fillStyle = e.button == 2 ? el.zatravka.value : el.edgecolor.value;

        if (e.button == 0){
            MainPad(obj, 1);
            MainPad(obj, 2);
        }
        else
            MainPad(obj, 6);
        ctx.fillRect(x, y, 1, 1);
      });
}


/**
 * подготовка канваса к работе
 */
function prepareCanvas(){
    const canvas = document.getElementById('container');
    window.width = window.innerWidth;
    window.height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; //* @typedef string
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * добавление кривых на канвас
 */
function addCurvesToCanvas(){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var el = document.getElementById("collect-data"); //* @typedef html-object
    var obj = create_obj();
    canvas.onmousedown = function(e){
        MainPad(obj, 5);
        if (e.button == 0){
            canvas.onmousemove = function(e){
                var [x, y] = convertToCanvas(canvas, e.clientX, e.clientY);

                ctx.fillStyle = el.edgecolor.value;       
                ctx.fillRect(x, y, 3, 3);
                obj.arrofdots.push([x, y]);
            };
            canvas.onmouseup = function(e){
                canvas.onmousemove = null;
            }
        }
    }
}


/**
 * точка входа в программу
 */
function EventsPad(){
    prepareCanvas();
    addButton();
    addPixelToCanvas();
    addCurvesToCanvas();
}


EventsPad();            // add events on all buttons and another