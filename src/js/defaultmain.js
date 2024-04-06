import { EventsPad } from './events.js';
import { create_obj, GeometricalPad } from './geometrical_objects.js';

var obj = create_obj(); //* @typedef user-js-object(c-struct analog)
GeometricalPad(obj, 3); // add layer to stage
GeometricalPad(obj, 2); // refresh layer
EventsPad();            // add events on all buttons and another