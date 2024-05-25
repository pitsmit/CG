import { MainPad } from './algho_runner.js';

/**
 * создание универсальной структуры для передачи нужных данных туда сюда
 * @returns структура(объект js)
 */
function create_obj(){return {
    rescolor: "",
    fromx: 0,
    tox: 0,
    stepx: 0,
    fromz: 0,
    toz: 0,
    stepz: 0,
    funcid: 0,
};}


/**
 * ставит на кнопки действия
 */
function addButton() {
    const canvas = document.getElementById('container');
    let ctx = canvas.getContext("2d");
    let obj = create_obj(); //* @typedef user-js-object(c-struct analog)

    document.getElementById("submit").addEventListener("click", (function() {
        let el = document.getElementById('collect-data'); //* @typedef html-object
        obj.rescolor = el.rescolor.value;
        obj.fromx = el.fromx.value;
        obj.tox = el.tox.value;
        obj.stepx = el.stepx.value;

        obj.fromz = el.fromz.value;
        obj.toz = el.toz.value;
        obj.stepz = el.stepz.value;

        let rb = el.getElementsByClassName("functionradio");
        for (let i = 0; i < rb.length; i++)
            if (rb[i].checked)
                obj.funcid = i;

    }));
    document.getElementById("clear").addEventListener("click", (function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }));

    document.getElementById("rotatex").addEventListener("click", (function() {
        let grad = parseFloat(document.getElementById("xrot").value);
        //rotatex
    }));
    document.getElementById("rotatey").addEventListener("click", (function() {
        let grad = parseFloat(document.getElementById("yrot").value);
        //rotatey
    }));
    document.getElementById("rotatez").addEventListener("click", (function() {
        let grad = parseFloat(document.getElementById("zrot").value);
        //rotatez
    }));
    
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

    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; //* @typedef string
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * точка входа в программу
 */
function Main(){
    prepareCanvas();
    addButton();
}


Main();