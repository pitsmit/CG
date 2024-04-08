import { MakeMove } from './mover.js';
import { MakeScale } from './scaler.js';
import { MakeRotate } from './rotator.js';
import { Info, Task, Instruction } from './info-functions.js';
import { obj } from './geometrical_objects.js';

/**
 * зумирование канваса при прокрутке колёсика
 */
export function addWheel(){
    const scaleBy = 1.05;
    obj.stage.on('wheel', (e) => {
        e.evt.preventDefault();

        var oldScale = obj.stage.scaleX();
        
        var pointer = obj.stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - obj.stage.x()) / oldScale,
            y: (pointer.y - obj.stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1;

        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        if (oldScale >= 5 && direction > 0)
            return;

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        obj.stage.scale({ x: newScale, y: newScale });
        obj.xAxis.points()[0] = Math.min(-obj.stage.width() / obj.stage.scale().x, -obj.stage.width());
        obj.xAxis.points()[2] = Math.max(obj.stage.width() / obj.stage.scale().x, obj.stage.width());
        obj.yAxis.points()[1] = Math.min(-obj.stage.height() / obj.stage.scale().y, -obj.stage.height());
        obj.yAxis.points()[3] = Math.max(obj.stage.height() / obj.stage.scale().y, obj.stage.height());

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        obj.stage.position(newPos);
        obj.stage.batchDraw();
    });
}


/**
 * добавление действий на кнопки
 * @param {function} DelFromStack 
 * @param {function} StackReset 
 * @param {konva-object} CatGroup 
 */
export function addButton(DelFromStack, StackReset, CatGroup){
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);

    document.getElementById('mover').addEventListener("submit", function(){
        MakeMove(CatGroup);
    });
    document.getElementById('scaling').addEventListener("submit", function(){
        MakeScale(CatGroup);
    });
    document.getElementById('rotator').addEventListener("submit", function(){
        MakeRotate(CatGroup);
    });
    document.getElementById('back-button').addEventListener("click", function(){
        DelFromStack(CatGroup);
    });
    document.getElementById('reset-button').addEventListener("click", function(){
        StackReset(CatGroup);
    });
}
