import {
    LibraryFunction,
    CDA,
    BrezReal,
    BrezInt,
    BrezNoSteps,
    BY
} from './algho_runner.js';


export function SwitchAlgorithm(option_value, xn, yn, xk, yk, color, layer, width, height){
    switch (option_value) {
        case "library-function":
            LibraryFunction(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "CDA":
            CDA(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezReal":
            BrezReal(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezInt":
            BrezInt(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BrezNoSteps":
            BrezNoSteps(xn, yn, xk, yk, color, layer, width, height);
            break;
        case "BY":
            BY(xn, yn, xk, yk, color, layer, width, height);
            break;
    }
}