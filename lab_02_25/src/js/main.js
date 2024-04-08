import { CatGroup, CatInit, GeometricalPad } from './geometrical_objects.js';
import { addWheel, addButton } from './events.js';
import { StackPush, DelFromStack, StackReset } from './stack.js';

GeometricalPad(1);
GeometricalPad(2);

addWheel();
CatInit();
StackPush(CatGroup);
addButton(DelFromStack, StackReset, CatGroup);