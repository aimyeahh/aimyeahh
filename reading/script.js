const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const second = document.getElementById('second');

const start = document.getElementById('start');
const reset = document.getElementById('reset');

const disp = document.getElementById('disp');

var interval = null;
var total = 00;

totalValue = ()=>{
    total = Number(hour.value)*3600 + Number(minute.value)*60 + Number(second.value);
}

Timer = ()=>{
    totalValue(); 
    total--;

    if(total >= 00)
    {
       var hr = Math.floor(total/3600);
       var mt = Math.floor((total/60) - (hr*60));
       var sc = total - ((hr*3600) + (mt*60));

       hour.value = hr;
       minute.value = mt;
       second.value = sc;
    }
    else{
        disp.innerText = "Time Over";
    }
}

start.addEventListener('click', ()=>{
    clearInterval(interval);
    interval = setInterval(Timer, 1000);

    disp.innerText = "Timer Started";
});

reset.addEventListener('click', ()=>{

    clearInterval(interval);

    hour.value = '00';
    minute.value = '00';
    second.value = '00';

    disp.innerText = "Timer Reset";
});