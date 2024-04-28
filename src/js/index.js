import { MainPad } from './algho_runner.js';
import { CDA } from './base_algo.js';

/**
 * создание универсальной структуры для передачи нужных данных туда сюда
 * @returns структура(объект js)
 */
function create_obj(){return {
    xn: 0, 
    yn: 0, 
    xk: 0,
    yk: 0,
    xleft: 0,
    xright: 0,
    ylow: 0,
    yhigh: 0,
    linecolor: "", 
    cuttercolor: "",
    rescolor: "",
    };}


/**
 * ставит на кнопки действия
 */
function addButton() {
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var obj = create_obj(); //* @typedef user-js-object(c-struct analog)

    document.getElementById("submit").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        obj.linecolor = el.linecolor.value;
        obj.cuttercolor = el.cuttercolor.value;
        obj.rescolor = el.rescolor.value;
        MainPad(obj, 3);        // fill figure 
    }));
    document.getElementById("clear").addEventListener("click", (function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        MainPad(obj, 2);
    }));
    document.getElementById("add").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        [obj.xn, obj.yn, obj.xk, obj.yk, obj.linecolor] = [parseFloat(el.xn.value) + width / 2, height / 2 - parseFloat(el.yn.value), 
                                                           parseFloat(el.xk.value) + width / 2, height / 2 - parseFloat(el.yk.value), 
                                                           el.linecolor.value];
        if ((!obj.xn && obj.xn != 0) || (!obj.yn && obj.yn != 0) || (!obj.xk && obj.xk != 0) || (!obj.yk && obj.yk != 0))
            return;

        MainPad(obj, 4);
        CDA(obj.xn, obj.yn, obj.xk, obj.yk, el.linecolor.value);
        MainPad(obj, 1);        // add line to data
    }));
    document.getElementById("viewcutter").addEventListener("click", (function() {
        var el = document.getElementById('collect-data'); //* @typedef html-object
        [obj.xleft, obj.xright, obj.ylow, obj.yhigh, obj.cuttercolor] = [parseFloat(el.xleft.value) + width / 2, parseFloat(el.xright.value) + width / 2, 
                                                                         height / 2 - parseFloat(el.ylow.value), height / 2 - parseFloat(el.yhigh.value), 
                                                                         el.cuttercolor.value];
        MainPad(obj, 4);
        MainPad(obj, 6);
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
        MainPad(obj, 4);

        var [x, y] = convertToCanvas(canvas, e.clientX, e.clientY);
        [obj.xn, obj.yn, obj.linecolor, obj.cuttercolor] = [x, y, el.linecolor.value, el.cuttercolor.value];

        ctx.fillStyle = e.button == 2 ? el.cuttercolor.value : el.linecolor.value;

        if (e.button == 0){
            MainPad(obj, 5); // push dot
        }
        else{
            MainPad(obj, 7);
        }
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
 * точка входа в программу
 */
function EventsPad(){
    prepareCanvas();
    addButton();
    addPixelToCanvas();
}


EventsPad();            // add events on all buttons and another