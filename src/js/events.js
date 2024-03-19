import {Info,Task,Instruction} from './info-functions.js';

/**
 * зумирование канваса при прокрутке колёсика
 * @param {konva-obj} stage сцена (основа канваса)
 * @param {konva-obj} layer сам канвас
 * @param {konva-obj} xAxis ось х
 * @param {konva-obj} yAxis ось у
 */
export function addWheel(stage, layer, xAxis, yAxis) {
    const scaleBy = 1.05; //* @typedef number
    stage.on('wheel', (e) => {
        e.evt.preventDefault();

        var oldScale = stage.scaleX(); //* @typedef number

        var pointer = stage.getPointerPosition(); //* @typedef konva-object

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1; //* @typedef number

        if (e.evt.ctrlKey)
            direction = -direction;

        if (oldScale >= 5 && direction > 0)
            return;

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy; //* @typedef number

        stage.scale({
            x: newScale,
            y: newScale
        });
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


/**
 * ставит на кнопки действия
 * @param {string} onoffformname form id
 */
export function addButton(onoffformname = NaN) {
    document.getElementById("info").addEventListener("click", Info);
    document.getElementById("task").addEventListener("click", Task);
    document.getElementById("instruction").addEventListener("click", Instruction);

    if (!onoffformname)
        return;

    var radios = document.forms[onoffformname].elements["fig"]; //* @typedef html-object

    radios[0].addEventListener('click', () => {
        document.getElementById('collect-data-for-circle-div').style.display = "block";
        document.getElementById('collect-data-for-ellipse-div').style.display = "none";
    });


    radios[1].addEventListener('click', () => {
        document.getElementById('collect-data-for-ellipse-div').style.display = "block";
        document.getElementById('collect-data-for-circle-div').style.display = "none";
    });
}