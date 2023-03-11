const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const second = document.getElementById('second');


let check = Number(localStorage.getItem('total'))
if (check > 0) {
    document.getElementById('hour').value = localStorage.getItem('hour')
    document.getElementById('minute').value = localStorage.getItem('minute')
    document.getElementById('second').value = localStorage.getItem('second')
    interval = setInterval(Timer, 1000);
} else {
    localStorage.setItem('hour', hour.value)
    localStorage.setItem('minute', minute.value)
    localStorage.setItem('second', second.value)
}

const start = document.getElementById('start');
const reset = document.getElementById('reset');

const disp = document.getElementById('disp');

var interval = null;
var total = 00;
localStorage.setItem('total', total)

totalValue = () => {
    total = Number(hour.value) * 3600 + Number(minute.value) * 60 + Number(second.value);
    localStorage.setItem('total', total)
}

function Timer(){
    totalValue();
    total--;
    console.log(total)
    localStorage.setItem('total', total)
    if (total >= 00) {
        var hr = Math.floor(total / 3600);
        var mt = Math.floor((total / 60) - (hr * 60));
        var sc = total - ((hr * 3600) + (mt * 60));

        hour.value = hr;
        minute.value = mt;
        second.value = sc;

        localStorage.setItem('hour', hour.value)
        localStorage.setItem('minute', minute.value)
        localStorage.setItem('second', second.value)
    }
    else {

        let sound = new Audio('sound.mp3');
        sound.play();
        clearInterval(interval);
        disp.innerText = "Time Over!!!";

    }
}

start.addEventListener('click', () => {
    clearInterval(interval);
    interval = setInterval(Timer, 1000);

    disp.innerText = "Timer Started";
});

reset.addEventListener('click', () => {

    clearInterval(interval);

    hour.value = '00';
    minute.value = '00';
    second.value = '00';
    localStorage.setItem('hour', "00")
    localStorage.setItem('minute', "00")
    localStorage.setItem('second', "00")

    disp.innerText = "Timer Reset";
});