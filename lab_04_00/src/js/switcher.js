import {
    LibraryFunctionCircle,
    LibraryFunctionEllipse,
    BrezCircle,
    BrezEllipse,
    CanonCircle,
    CanonEllipse,
    ParamCircle,
    ParamEllipse
} from './algho_runner.js';


/**
 * выбор функции построения в зависимости от фигуры
 * @param {function} func1 
 * @param {function} func2 
 * @param {string} fig_option 
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 * @param {konva-object} layer полотно для рисования
 * @param {number} r 
 * @param {number} a 
 * @param {number} b 
 */
function ChoiceCircleEllipse(func1, func2, fig_option, x, y, color, layer, r, a, b){
    fig_option == "circle" ? func1(x, y, color, layer, r) : func2(x, y, color, layer, a, b);
}


/**
 * 
 * @param {string} alg_option название алгоритма
 * @param {string} fig_option название фигуры
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} r 
 * @param {number} a 
 * @param {number} b 
 */
export function SwitchAlg(alg_option, fig_option, x, y, color, layer, r, a, b){
    switch (alg_option) {
        case "library-function":
            ChoiceCircleEllipse(LibraryFunctionCircle, LibraryFunctionEllipse, fig_option, x, y, color, layer, r, a, b);
            break;
        case "Brez":
            ChoiceCircleEllipse(BrezCircle, BrezEllipse, fig_option, x, y, color, layer, r, a, b);
            break;
        case "Canon":
            ChoiceCircleEllipse(CanonCircle, CanonEllipse, fig_option, x, y, color, layer, r, a, b);
            break;
        case "Param":
            ChoiceCircleEllipse(ParamCircle, ParamEllipse, fig_option, x, y, color, layer, r, a, b);
            break;
    }
}