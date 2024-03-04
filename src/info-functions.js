export function Info() {
    window.open(
        'info.html',
        '_blank'
      );
}


export function Task() {
    window.open(
        'task.html',
        '_blank'
      );
}


export function Instruction() {
    window.open(
        'instruction.html',
        '_blank'
      );
}



document.getElementById("info").addEventListener("click", Info);
document.getElementById("task").addEventListener("click", Task);
document.getElementById("instruction").addEventListener("click", Instruction);