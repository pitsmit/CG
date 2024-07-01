import { create_obj_circle, create_obj, GeometricalPad } from "./graphical_objects.js";
import { Info, Task, Instruction } from './info-functions.js';
import { RunWithFile } from './file.js';
import { TablePad } from "./tables.js";


function LeftClick(groupCircles, ResGroup){
    var obj = create_obj();

    obj.stage.addEventListener('click', function(e) {
        ResGroup.destroy();
        if (e.button != 0)
            return;
        var pointer = obj.stage.getRelativePointerPosition();
        var circle = create_obj_circle(pointer.x, pointer.y, 5, 'red');
        groupCircles.add(circle);
        GeometricalPad(obj, 5);
        [obj.x, obj.y, obj.tableId] = [pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4), 'multi1'];
        TablePad(obj, 2); // addline
    });
}


function RightClick(groupCircles, ResGroup){
    var obj = create_obj();

    obj.stage.addEventListener('contextmenu', function(e) {
        ResGroup.destroy();
        var pointer = obj.stage.getRelativePointerPosition();
        var circle = create_obj_circle(pointer.x, pointer.y, 5, 'green');
        groupCircles.add(circle);
        GeometricalPad(obj, 5);
        [obj.x, obj.y, obj.tableId] = [pointer.x.toFixed(4) - width / 2, height / 2 - pointer.y.toFixed(4), 'multi2'];
        TablePad(obj, 2);
    });
}

function Scale(){
    var obj = create_obj();
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


export function AddActions(groupCircles, ResGroup){
    LeftClick(groupCircles, ResGroup);
    RightClick(groupCircles, ResGroup);
    Scale();
}


function CycleAddDot(xid, yid, tabid){
    var x = document.getElementById(xid); //* @typedef html-object
    var y = document.getElementById(yid); //* @typedef html-object
    [obj.x, obj.y, obj.tableId] = [parseFloat(x.value), parseFloat(y.value), tabid];
    if (isNaN(parseFloat(obj.x)) || isNaN(parseFloat(obj.y)))
        return;
    TablePad(obj, 2);       // add line to table
}


export function AddButton(Run, ResGroup, groupCircles){
    var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
    document.getElementById("addbutton1").addEventListener("click", function(){
        CycleAddDot("x1", "y1", "multi1");
    });
    document.getElementById("addbutton2").addEventListener("click", function(){
        CycleAddDot("x2", "y2", "multi2");
    });
    document.getElementById("file-button").addEventListener("click", function(){
        RunWithFile('multi1', 'multi2');
    });
    
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);
    document.getElementById("runner").addEventListener("click", Run);
    document.getElementById("clear-button").addEventListener("click", function(){
        ResGroup.destroy();
        groupCircles.destroy();
        TablePad(obj, 1);
    });
}