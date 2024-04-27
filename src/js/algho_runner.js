import { CDA } from "./base_algo.js";
import { TablePad } from "./tables.js";

var DOTS = []
var FLAG = 0
var ZATRAVKA = {x: NaN, y: NaN}


function pushdot(obj){DOTS.push([obj.x, obj.y]);}

function SetZatravka(obj){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(ZATRAVKA.x + width / 2, height / 2 - ZATRAVKA.y, 1, 1);
    [ZATRAVKA.x, ZATRAVKA.y] = [obj.x, obj.y];
}


/**
 * отрисовка ребра
 */
function makeedge(obj){
    if (DOTS.length < 2)
        return;

    CDA(DOTS[DOTS.length - 1][0], DOTS[DOTS.length - 1][1], DOTS[DOTS.length - 2][0], DOTS[DOTS.length - 2][1], obj.color);
}


function cleardots(){DOTS = [];}


/**
 * проверка количества вершин фигуры перед построением
 * @returns number код завершения функции
 */
function CheckDotsLength(){
    if (DOTS.length < 3){
        alert("Ошибка! Нужно ввести хотя бы 3 точки!");
        return -1;
    }
    return 0;
}


/**
 * отрисовка последнего ребра перед закраской
 * @returns объект промиса(борьба с асинхроностью)
 */
function PlotLastEdge(){
    return new Promise(() => {
        if (FLAG == 0){
            var el = document.getElementById('collect-data'); //* @typedef html-object
            var color = el.edgecolor.value;
            CDA(DOTS[DOTS.length - 1][0], DOTS[DOTS.length - 1][1], DOTS[0][0], DOTS[0][1], color);
        }
    });
}


/**
 * изменение статуса отображения колёсика прогрузки
 * @param {string} state состояние для колёсика прогрузки
 * @returns объект Promise(в данном случае это необходимо для внедрения асинхроности процессов)
 */
function reverseLoader(state){
    return new Promise((resolve) => {
        document.getElementById("loader").style.display = state;
        resolve();
        setTimeout(() => {
            resolve();
        }, 1);
    });
}


/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    var rc = CheckDotsLength(); //* @typedef number
    if (rc != 0)
        return;

    var summm = 0; //* @typedef number
    reverseLoader("block").then(PlotLastEdge()).then(() => {
        summm = FillFigure(obj);
    }).then(() => {
        setTimeout(function() {
            reverseLoader("none");
       }, summm);
    })

    FLAG = 1
}


/**
 * очистка таблиц и канваса в случае если пользователю уже закрасилось что-то
 */
function ClearIfEmpty(){
    if (FLAG == 1){
        const canvas = document.getElementById('container');
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        TablePad(NaN, 1);
        cleardots(); 
        FLAG = 0;
    }
}


function draw_pixel(x, y, color){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color; //* @typedef string
    ctx.fillRect(x + width / 2, height / 2 - y, 1, 1);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function get_pixel_color(x, y){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(x + width / 2, height / 2 - y, 1, 1);
    var data = imageData.data;
    
    var red = data[0];
    var green = data[1];
    var blue = data[2];

    return rgbToHex(data[0], data[1], data[2]);
}

function Point(x, y){
    var pp = {x: x, y: y};

    return pp;
}

function FillFigure(obj){
    if (obj.border_colour == obj.color){
        alert("Предупреждение! Цвет границы и цвет закраски не должны совпадать!")
        return
    }
    if (obj.border_colour == "#ffffff"){
        alert("Предупреждение! Цвет границы и цвет фона не должны совпадать!")
        return
    }
    if ("#ffffff" == obj.color){
        alert("Предупреждение! Цвет фона и цвет закраски не должны совпадать!")
        return
    }
    if (!ZATRAVKA.x && ZATRAVKA.x != 0){
        alert("Предупреждение! нет затравочного пикселя!")
        return
    }
    
    var fill_colour = obj.color;
    var border_colour = obj.border_colour;

    console.log(fill_colour, border_colour, ZATRAVKA);

    var stack = [ZATRAVKA];
    while (stack.length != 0){
        var seed_pixel = stack.pop()
        var x = Math.round(seed_pixel.x);
        var y = Math.round(seed_pixel.y);
        console.log(x, y);

        draw_pixel(x, y, fill_colour)
        var tx = x
        var ty = y

        x += 1

        console.log(get_pixel_color(x, y), fill_colour, border_colour, x, width);
        while (get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour && x <  width){
            draw_pixel(x, y, fill_colour)
            x += 1
        }

        var xr = x - 1

        x = tx - 1
        while (get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour && x > 0){
            draw_pixel(x, y, fill_colour)
            x -= 1
        }

        var xl = x + 1

        x = xl
        if (ty < height){
            y = ty + 1

            while (x <= xr){
                var flag = false

                while (get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour && x <= xr){
                    flag = true
                    x += 1
                }

                if (flag){
                    if (x == xr && get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour){
                        if (y < height)
                            stack.push(Point(x, y))
                    }
                    else{
                        if (y < height)
                            stack.push(Point(x - 1, y))
                    }

                    flag = false
                }
                var x_in = x
                while ((get_pixel_color(x, y) == fill_colour || get_pixel_color(x, y) == border_colour) && x < xr)
                    x = x + 1

                if (x == x_in)
                    x += 1
            }
        }
        x = xl
        y = ty - 1

        while (x <= xr){
            var flag = false

            while (get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour && x <= xr){
                flag = true
                x += 1
            }

            if (flag) {
                if (x == xr && get_pixel_color(x, y) != fill_colour && get_pixel_color(x, y) != border_colour){
                    if (y > 0)
                        stack.push(Point(x, y))
                }
                else{
                    if (y > 0)
                        stack.push(Point(x - 1, y))
                }

                flag = false
            }

            var x_in = x
            while ((get_pixel_color(x, y) == fill_colour || get_pixel_color(x, y) == border_colour) && x < xr)
                x = x + 1

            if (x == x_in)
                x += 1
        }
        //if delay:
         //   canvas.update()
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