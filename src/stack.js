export function StackPush(stack, Group){
    stack.push([
        Group.getAttr('x'),
        Group.getAttr('y'),
        Group.getAttr('scaleX'),
        Group.getAttr('scaleY'),
        Group.getAttr('rotation'),
    ]);
}


export function DelFromStack(Group, st){
    if (st.length == 1){
        Group.setAttr('x', st[0][0]);
        Group.setAttr('y', st[0][1]);
        Group.setAttr('scaleX', st[0][2]);
        Group.setAttr('scaleY', st[0][3]);
        Group.setAttr('rotation', st[0][4]);
        return;
    }
    var res = st.pop();
    Group.setAttr('x', res[0]);
    Group.setAttr('y', res[1]);
    Group.setAttr('scaleX', res[2]);
    Group.setAttr('scaleY', res[3]);
    Group.setAttr('rotation', res[4]);
}