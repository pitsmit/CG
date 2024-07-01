import { CDA, SetRect } from "./base_algo.js";

var DOTS = []
var FLAG = 0
var ZATRAVKA = {x: NaN, y: NaN}

function pushdot(obj){DOTS.push([obj.x, obj.y]);}
function cleardots(){DOTS = [];}
function Point(x, y){return {x: x, y: y};}

/**
 * установка затравочного пикселя
 * @param {user-js struct} obj объект с данными для отрисовки
 */
function SetZatravka(obj){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(ZATRAVKA.x, ZATRAVKA.y, 1, 1);
    [ZATRAVKA.x, ZATRAVKA.y] = [obj.x, obj.y];
}


/**
 * отрисовка ребра
 * @param {user-js struct} obj объект с данными для отрисовки
 */
function makeedge(obj){
    if (DOTS.length < 2)
        return;

    CDA(DOTS[DOTS.length - 1][0], DOTS[DOTS.length - 1][1], DOTS[DOTS.length - 2][0], DOTS[DOTS.length - 2][1], obj.color);
}


/**
 * отрисовка последнего ребра перед закраской
 */
function PlotLastEdge(){
    if (FLAG == 0 && DOTS.length != 0){
        var el = document.getElementById('collect-data'); //* @typefunction html-object
        var color = el.edgecolor.value;
        CDA(DOTS[DOTS.length - 1][0], DOTS[DOTS.length - 1][1], DOTS[0][0], DOTS[0][1], color);
    }
}


/**
 * проверка данных для закраски перед началом алгоритма
 * @param {user-js struct} obj объект с данными для отрисовки
 * @returns код завершения функции
 */
function CheckPlotData(obj){
    if (obj.border_colour == obj.color){
        alert("Ошибка! Цвет границы и цвет закраски не должны совпадать!");
        return -1;
    }
    if (obj.border_colour == "#ffffff"){
        alert("Ошибка! Цвет границы и цвет фона не должны совпадать!");
        return -1;
    }
    if ("#ffffff" == obj.color){
        alert("Ошибка! Цвет фона и цвет закраски не должны совпадать!");
        return -1;
    }
    if (!ZATRAVKA.x && ZATRAVKA.x != 0){
        alert("Ошибка! нет затравочного пикселя!");
        return -1;
    }

    return 0;
}


/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    PlotLastEdge();
    if (CheckPlotData(obj) != 0)
        return;
    FillFigure(obj);

    FLAG = 1;
}


/**
 * очистка таблиц и канваса в случае если пользователю уже закрасилось что-то
 */
function ClearIfEmpty(){
    if (FLAG == 1){
        const canvas = document.getElementById('container');
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; //* @typefunction string
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cleardots(); 
        FLAG = 0;
        [ZATRAVKA.x, ZATRAVKA.y] = [NaN, NaN];
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


/**
 * получение цвета пикселя
 * @param {number} x 
 * @param {number} y 
 * @returns string цвет пикселя
 */
function GetColorPixel(x, y){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(x, y, 1, 1);
    var data = imageData.data;

    return "#" + componentToHex(data[0]) + componentToHex(data[1]) + componentToHex(data[2]);
}


/**
 * добавление пикслей для следующих итераций
 * @param {array of coordinates} stack 
 * @param {number} xr 
 * @param {number} x 
 * @param {number} y 
 * @param {user-js object} obj данные для рисования 
 */
function SearchPixel(stack, xr, x, y, obj){
    while (x <= xr){
        var flag = false;
        while (GetColorPixel(x, y) != obj.color && GetColorPixel(x, y) != obj.border_colour && x <= xr){
            if (flag == false)
                flag = true;
            x += 1;
        }
        if (flag){
            if (x == xr && (GetColorPixel(x, y) != obj.color) && (GetColorPixel(x, y) != obj.border_colour))
                stack.push(Point(x, y));
            else
                stack.push(Point(x - 1, y));
            flag = false;
        }

        var x_temp = x;
        while (GetColorPixel(x, y) == obj.color || GetColorPixel(x, y) == obj.border_colour && x < xr)
            x += 1;

        if (x == x_temp)
            x += 1;
    }
}


/**
 * закраска пикслей справа от текущего при вызове
 * @param {number} x 
 * @param {number} y 
 * @param {user-js object} obj данные для рисования 
 * @returns новые координаты x
 */
function RunRight(x, y, obj){
    while (GetColorPixel(Math.round(x), Math.round(y)) != obj.border_colour){
        SetRect(x, y);
        x += 1;
    }

    return x - 1;
}


/**
 * закраска пикслей слева от текущего при вызове
 * @param {number} x 
 * @param {number} y 
 * @param {user-js object} obj данные для рисования 
 * @returns новые координаты x
 */
function RunLeft(x, y, obj){
    while (GetColorPixel(Math.round(x), Math.round(y)) != obj.border_colour){
        SetRect(x, y);
        x -= 1;
    }

    return x + 1;
}

/**
 * основной алгоритм отрисовки
 * @param {user-js object} obj данные для рисования 
 */
async function FillFigure(obj){
    var stack = [ZATRAVKA];

    while (stack.length != 0){
        await new Promise(resolve => setTimeout(resolve, obj.delay));
        var pt = stack.pop();
        var [x, y] = [pt.x, pt.y];
        SetRect(x, y, obj.color);
        var xr = RunRight(x + 1, y, obj);
        var xl = RunLeft(x - 1, y, obj);
        SearchPixel(stack, xr, xl, y + 1, obj);
        SearchPixel(stack, xr, xl, y - 1, obj);
    }
}


/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    var arrfunc = [pushdot, makeedge, cleardots, FILL, ClearIfEmpty, SetZatravka];

    arrfunc[FuncNumber - 1](obj);
}