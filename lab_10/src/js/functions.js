function f1(x, z){return Math.cos(x * z);}
function f2(x, z){return Math.sin(x) * Math.cos(z);}
function f3(x, z){return Math.log(x) * Math.log(z);}
function f4(x, z){return Math.sin(x + z);}

export function FunctionPad(id){
    let arr = [f1, f2, f3, f4];

    return arr[id];
}


/**
 * закраска пикслея
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 */
export function SetRect(x, y, color, r=1){
    const canvas = document.getElementById('container');
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), r, r);
}