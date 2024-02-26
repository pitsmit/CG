export function MakeMove(Group, layer, stack) {
    var el = document.getElementById('mover');
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    var n_x = Group.getAttr('x');
    var n_y = Group.getAttr('y');

    var new_x = Module._add(dx, n_x);
    var new_y = Module._add(dy, n_y);
    Group.setAttr('x', new_x);
    Group.setAttr('y', new_y);

    layer.draw();

    stack.push([
        Group.getAttr('x'),
        Group.getAttr('y'),
        Group.getAttr('scaleX'),
        Group.getAttr('scaleY'),
        Group.getAttr('rotation'),
    ]);
}