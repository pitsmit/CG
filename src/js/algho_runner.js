import { CDA } from "./base_algo.js";




/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    let arrfunc = [];

    arrfunc[FuncNumber - 1](obj);
}