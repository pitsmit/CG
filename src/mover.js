export function MakeMove(Group, layer) {
    var el = document.getElementById('mover');
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    Group.setAttr('x', dx + Group.getAttr('x'));
    Group.setAttr('y', dy + Group.getAttr('y'));
   // Group.setAttr('scale', 50000);
    layer.draw();
}