const width = window.innerWidth;
const height = window.innerHeight;

export function MakeRotate(Group, layer, stack){
    var el = document.getElementById('rotator');
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var q = Number(el.q.value);

    var now_x = Group.getAttr('x') - width / 2;
    var now_y = height / 2 - Group.getAttr('y');

    var want_x = x + (now_x - x) * Math.cos(q * Math.PI / 180) + (now_y - y) * Math.sin(q * Math.PI / 180);
    var want_y = y - (now_x - x) * Math.sin(q * Math.PI / 180) + (now_y - y) * Math.cos(q * Math.PI / 180);

    Group.setAttr('x', want_x + width / 2);
    Group.setAttr('y', height / 2 - want_y);

    Group.setAttr('rotation', q + Group.getAttr('rotation'));

    layer.draw();

    stack.push([
        Group.getAttr('x'),
        Group.getAttr('y'),
        Group.getAttr('scaleX'),
        Group.getAttr('scaleY'),
        Group.getAttr('rotation'),
    ]);
}