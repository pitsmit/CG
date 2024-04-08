var stack = [];

/**
 * добавление состояния в стек состояний
 * @param {konva-object} Group объект
 */
export function StackPush(Group){
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
 */
export function DelFromStack(Group){
    if (stack.length == 1){
        Group.setAttr('x', stack[0][0]);
        Group.setAttr('y', stack[0][1]);
        Group.setAttr('scaleX', stack[0][2]);
        Group.setAttr('scaleY', stack[0][3]);
        Group.setAttr('rotation', stack[0][4]);
        return;
    }
    var res = stack.pop();
    Group.setAttr('x', res[0]);
    Group.setAttr('y', res[1]);
    Group.setAttr('scaleX', res[2]);
    Group.setAttr('scaleY', res[3]);
    Group.setAttr('rotation', res[4]);
}


/**
 * очистка стэка и возврат к исходному состоянию объекта
 * @param {konva-object} Group объект
 */
export function StackReset(Group){
    while(stack.length != 1)
        stack.pop();

    Group.setAttr('x', stack[0][0]);
    Group.setAttr('y', stack[0][1]);
    Group.setAttr('scaleX', stack[0][2]);
    Group.setAttr('scaleY', stack[0][3]);
    Group.setAttr('rotation', stack[0][4]);
}