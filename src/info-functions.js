export function Info() {
    alert("Смирнов Пётр Ильич, ИУ7-45Б");
}


function Task() {
    alert("Лабораторная работа №2. Вариант №25.\nНарисовать исходный рисунок(кот), затем осуществить его перенос, масштабирование и поворот");
}


function Instruction() {
    alert("затычка");
}


document.getElementById("info").addEventListener("click", Info);
document.getElementById("task").addEventListener("click", Task);
document.getElementById("instruction").addEventListener("click", Instruction);