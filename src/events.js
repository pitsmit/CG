export function addWheel(stage, layer, xAxis, yAxis){
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


export function addButton(Info, Task, Instruction, MakeMove, MakeScale, MakeRotate, DelFromStack, CatGroup, layer, stack){
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);

    document.getElementById('mover').addEventListener("submit", function(){
        MakeMove(CatGroup, layer, stack);
    });
    document.getElementById('scaling').addEventListener("submit", function(){
        MakeScale(CatGroup, layer, stack);
    });
    document.getElementById('rotator').addEventListener("submit", function(){
        MakeRotate(CatGroup, layer, stack);
    });
    document.getElementById('back-button').addEventListener("click", function(){
        DelFromStack(CatGroup, stack);
    });
}