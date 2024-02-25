export function MakeMove(Group, layer, stack) {
    var el = document.getElementById('mover');
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    Group.setAttr('x', dx + Group.getAttr('x'));
    Group.setAttr('y', dy + Group.getAttr('y'));
    layer.draw();

    stack.push([
        Group.getAttr('x'),
        Group.getAttr('y'),
        Group.getAttr('scaleX'),
        Group.getAttr('scaleY'),
        Group.getAttr('rotation'),
    ]);
}