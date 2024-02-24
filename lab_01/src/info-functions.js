export function Info() {
    alert("Смирнов Пётр Ильич, ИУ7-45Б");
}


function Task() {
    alert("Лабораторная работа №1. Вариант №19.\nДаны два множества точек на плоскости.\
 Найти пару окружностей(каждая из окружностей проходит\
 хотя бы через три различные точки одного и того же множества.\
 точки для разных окружностей берутся из разных множеств.) таких,\
 что прямая, соединяющая центры этих окружностей, образует минимальный\
 угол с осью ординат.");
}


function Instruction() {
    alert("затычка");
}


document.getElementById("info").addEventListener("click", Info);
document.getElementById("task").addEventListener("click", Task);
document.getElementById("instruction").addEventListener("click", Instruction);