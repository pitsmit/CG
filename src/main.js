import { stage, refresh_graph, CatGroup, CatInit, layer, XY } from './geometrical_objects.js';
import { MakeMove } from './mover.js';
import { MakeScale } from './scaler.js';
import { MakeRotate } from './rotator.js';
import { Info, Task, Instruction } from './info-functions.js';
import { addWheel, addButton } from './events.js';
import { StackPush, DelFromStack, StackReset } from './stack.js';

export var [xAxis, yAxis] = XY(stage);
var stack = [];
stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
CatInit(CatGroup, layer);
StackPush(stack, CatGroup);
addButton(Info, Task, Instruction, MakeMove, MakeScale, MakeRotate, DelFromStack, StackReset, CatGroup, layer, stack);