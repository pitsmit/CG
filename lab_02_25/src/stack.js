/**
 * добавление состояния в стек состояний
 * @param {array of konva-objects} stack стэк 
 * @param {konva-object} Group объект
 */
export function StackPush(stack, Group){
    stack.push([
        Group.getAttr('x'),
        Group.getAttr('y'),
        Group.getAttr('scaleX'),
        Group.getAttr('scaleY'),
        Group.getAttr('rotation'),
    ]);
}


/**
 * удаление последнего состояния из стека(отмена последнего действия)
 * @param {konva-object} Group объект
 * @param {array of konva-objects} st стэк 
 */
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


/**
 * очистка стэка и возврат к исходному состоянию объекта
 * @param {konva-object} Group объект
 * @param {array of konva-objects} st стэк
 */
export function StackReset(Group, st){
    while(st.length != 1)
        st.pop();

    Group.setAttr('x', st[0][0]);
    Group.setAttr('y', st[0][1]);
    Group.setAttr('scaleX', st[0][2]);
    Group.setAttr('scaleY', st[0][3]);
    Group.setAttr('rotation', st[0][4]);
}