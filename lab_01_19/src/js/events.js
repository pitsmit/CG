import { addline, ClearAll } from "./tables.js";
import { create_obj_circle } from "./graphical_objects.js";
import { Info, Task, Instruction } from './info-functions.js';
import { RunWithFile } from './file.js';

export function AddActions(stage, layer, groupCircles, ResGroup, xAxis, yAxis){
    stage.addEventListener('click', function(e) {
        ResGroup.destroy();
        if (e.button != 0)
            return;
        var pointer = stage.getRelativePointerPosition();
        var circle = create_obj_circle(pointer.x, pointer.y, 5, 'red');
        layer.add(circle);
        groupCircles.add(circle);
        layer.add(groupCircles);
        addline('multi1', pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4));
    });
    
    
    stage.addEventListener('contextmenu', function(e) {
        ResGroup.destroy();
        var pointer = stage.getRelativePointerPosition();
        var circle = create_obj_circle(pointer.x, pointer.y, 5, 'green');
        layer.add(circle);
        groupCircles.add(circle);
        layer.add(groupCircles);
        addline('multi2', pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4));
    });
    
    
    const scaleBy = 1.05;
    stage.on('wheel', (e) => {
        e.evt.preventDefault();
    
        var oldScale = stage.scaleX();
        
        var pointer = stage.getPointerPosition();
    
        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
    
        let direction = e.evt.deltaY > 0 ? -1 : 1;
    
        if (e.evt.ctrlKey) {
            direction = -direction;
        }
    
        if (oldScale >= 5 && direction > 0)
            return;
    
        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
        stage.scale({ x: newScale, y: newScale });
        xAxis.points()[0] = Math.min(-stage.width() / stage.scale().x, -stage.width());
        xAxis.points()[2] = Math.max(stage.width() / stage.scale().x, stage.width());
        yAxis.points()[1] = Math.min(-stage.height() / stage.scale().y, -stage.height());
        yAxis.points()[3] = Math.max(stage.height() / stage.scale().y, stage.height());
        layer.add(xAxis);
        layer.add(yAxis);
    
        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    });
}


export function AddButton(Run, ResGroup, groupCircles){
    document.getElementById("addbutton1").addEventListener("click", function(){
        addline('multi1', "", "");
    });
    document.getElementById("addbutton2").addEventListener("click", function(){
        addline('multi2', "", "");
    });
    document.getElementById("file-button").addEventListener("click", function(){
        RunWithFile('multi1', 'multi2');
    });
    
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);
    document.getElementById("runner").addEventListener("click", Run);
    document.getElementById("clear-button").addEventListener("click", function(){
        ClearAll(ResGroup, groupCircles);
    });
}