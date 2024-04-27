window.width = window.innerWidth;   //* @typedef number
window.height = window.innerHeight; //* @typedef number


/**
 * создание универсальной структуры для передачи нужных данных туда сюда
 * @returns структура(объект js)
 */
export function create_obj(){
    var obj = {x: 0, y: 0, x1plot: 0, x2plot: 0, y1plot: 0, y2plot: 0, color: "", delay: 0, arrofdots : [], border_colour: ""};

    return obj;
}


/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер вызванной функции
 * @returns значение вызванной функции
 */
export function GeometricalPad(obj, FuncNumber){
    var arrfunc = [create_obj];

    return arrfunc[FuncNumber - 1](obj);
}