import { addWheel, addButton } from './events.js';
import { layer, stage, xAxis, yAxis, refresh_graph } from './geometrical_objects.js';
import { SwitchAlghorithm } from './algho_runner.js';
import { Info, Task, Instruction } from './info-functions.js';

window.width = window.innerWidth;
window.height = window.innerHeight;

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton(Info, Task, Instruction, SwitchAlghorithm)